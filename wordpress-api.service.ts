import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import {
  WordpressApiConfig, UserCreate, UserResponse, UserUpdate, PostCreate,
  WordpressApiError, Categories, Post, Posts, SystemSettings,
  Site,
  Sites,
  DomainAdd
} from './wordpress-api.interface';
import { of, Observable } from 'rxjs';
import { ConfigToken } from './wordpress-api.config';



@Injectable()
export class WordpressApiService {

  static cache = {};

  constructor(
    @Inject(ConfigToken) private config: WordpressApiConfig,
    private http: HttpClient
  ) {
    console.log('WordpressApiConfig: config: ', this.config);
    this.doInit();
  }

  doInit() {
    console.log('WordpressApiService::doInit()');
    this.systemSettings().subscribe(res => res, e => console.error(e));
  }

  /**
   * Returns true if the error is equal to the error code.
   * @param e WordpresApiError
   * @param errorCode error code to compare
   */
  is(e: WordpressApiError, errorCode: string) {
    return e && e.code && e.code === errorCode;
  }

  /**
   * Returns true if the input object is an error of HttpClient coming from Backend.
   * @param e 400 (Bad Request) from Wordpress
   *    'e' has a raw http error response from HttpClient.
   *    {
   *      error: { code: ... , message: ... },
   *      message: ...,
   *      HttpErrorResponse: ...,
   *      ... and much more
   *    }
   */
  isBackendRawError(e) {
    if (e && e.error && e.error.code) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns { code: ..., message: .... } Object from Raw Http Error Response
   * @param e raw http error response
   */
  getError(e): WordpressApiError {
    if (this.isBackendRawError(e)) {
      return { code: e.error.code, message: e.error.message };
    } else {
      return { code: 'not_wordpress_error', message: 'This does look like backend error' };
    }
  }

  // get config(): WordpressApiConfig { return WordpressApiService.config; }
  get url(): string { return this.config.url; }
  get urlWordpressApiEndPoint(): string { return this.url + '/wp-json/wp/v2'; }
  get urlUsers(): string { return this.urlWordpressApiEndPoint + '/users'; }
  get urlPosts(): string { return this.urlWordpressApiEndPoint + '/posts'; }
  get urlCategories(): string { return this.urlWordpressApiEndPoint + '/categories'; }
  get urlSonubApi(): string { return this.url + '/wp-json/sonub/v2019'; }


  /**
   * Use this auth after login
   */
  get loginAuth() {
    return this.getHttpOptions({ user_login: this.myId, user_pass: this.mySecurityCode });
  }

  /**
   * Use this auth to login. After login, use `loginAuth`
   * @param email email
   * @param password password
   */
  private emailPasswordAuth(email, password) {
    return this.getHttpOptions({ user_login: email, user_pass: password });
  }



  /**
   * Returns Http Options
   * @param options options
   * @return any
   *
   * @example
   *  const options = this.getHttpOptions({ user_login: user.username, user_pass: user.password });
   */
  private getHttpOptions(options: {
    user_login: string;
    user_pass: string;
  } = <any>{}) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(`${options.user_login}:${options.user_pass}`),
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }

  /**
   * This is a wrapper of post which constrcuts a POST request to Wordpress Backend server.
   * @desc The reason for this method is to capture all the request and response for easy use.
   * @param url url
   * @param body body as json
   * @param options http options
   */
  public post<T>(url: string, json: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T> {
    return this.http.post<T>(url, json, options);
  }
  /**
   * This is a wrapper of HttpClient.get() to capture all the request and response for easy use.
   * @param url url
   * @param options http options
   */
  public get<T>(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe: 'events';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<HttpEvent<T>> {
    console.log('url:', url);
    return this.http.get<T>(url, options).pipe(
      catchError(e => {
        console.log('Got error on get()', e);
        const we = this.getError(e);
        console.log('we: ', we);
        throw we;
      })
    );
  }

  version(): Observable<string> {
    return <any>this.get(this.urlSonubApi + '/version');
  }

  /**
   * Gets system settings from live server or from cached memory data.
   * @desc since it caches on memory, you can call as many times as you want.
   *    It will response with data from memory.
   *
   * @example
       this.systemSettings().subscribe(res => res, e => console.error(e));
        setTimeout(() => {
          this.systemSettings().subscribe(res => res, e => console.error(e));
        }, 1000);
   */
  systemSettings(): Observable<SystemSettings> {
    const k = 'systemSettings';
    if (this.getCache(k)) {
      console.log('(c) Already got getSystemSettings. return cached data');
      return of(this.getCache(k));
    }
    return this.http.get<SystemSettings>(this.urlSonubApi + '/system-settings', this.loginAuth).pipe(
      tap(data => {
        console.log('(l) Got system settings from server: ', data);
        this.setCache(k, data);
      })
    );
  }

  /**
   * Registers
   * @param user User
   * @example
      wp.register({
        username: this.chance.email(),
        password: password,
        email: this.chance.email()
      }).subscribe(res => {
        console.log('user register: ', res);
      });
   */
  register(user: UserCreate) {
    return this.http.post<UserResponse>(this.urlUsers, user).pipe(
      tap(data => this.saveUserData(data))
    );
  }

  /**
   * Login user can update only his user data.
   * @param user User update data
   * @note user cannot change 'username'. But everything else is changable.
   */
  updateProfile(user: UserUpdate) {
    const options = this.getHttpOptions({ user_login: this.myId, user_pass: this.mySecurityCode });
    return this.http.post<UserResponse>(this.urlUsers + '/me', user, options).pipe(
      tap(data => this.saveUserData(data))
    );
  }
  /**
   * Get user data from wordpress via rest api
   * @param auth User auth with email & password.
   * @desc This method can be used to get security code.
   *    If the user didn't logged yet and want to login, you can call this mehtod with email & password auth.
   *    After getting user profile, you can use security code to continue access wordpress rest api.
   */
  profile(auth?): Observable<UserResponse> {
    if (!auth) {
      auth = this.loginAuth;
    }
    return <any>this.get(this.urlSonubApi + '/profile', auth).pipe(
      tap(data => this.saveUserData(<any>data))
    );
  }
  /**
   *
   * @param user UserData
   */
  private saveUserData(user: UserResponse) {
    localStorage.setItem('user_id', user.id.toString());
    localStorage.setItem('user_security_code', user.security_code);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_username', user.username);
    localStorage.setItem('user_nickname', user.nickname);
  }


  /**
   * This lets a user login and returns the login user's profile data.
   * @param email email
   * @param password password
   */
  login(email: string, password: string) {
    return this.profile(this.emailPasswordAuth(email, password));
  }

  logout() {
    localStorage.removeItem('user_id');
  }
  get isLogged() {
    return !!this.myId;
  }

  /**
   * Returns user data saved in localStorage.
   * @param key key sring like 'id', 'email', 'security_code', 'username'
   */
  private getUserData(key) {
    return localStorage.getItem('user_' + key);
  }
  get myId() {
    return this.getUserData('id');
  }
  get mySecurityCode() {
    return this.getUserData('security_code');
  }
  get myNickname() {
    return this.getUserData('nickname');
  }


  createPost(post: PostCreate) {
    return this.http.post<Post>(this.urlPosts, post, this.loginAuth);
  }
  getPosts() {
    return this.http.get<Posts>(this.urlPosts, this.loginAuth);
  }

  getCache(code) {
    if (WordpressApiService.cache[code]) {
      return WordpressApiService.cache[code];
    } else {
      return null;
    }
  }

  setCache(code, data) {
    WordpressApiService.cache[code] = data;
  }

  /**
   * Gets categories.
   * @desc Use this method to know categories.
   * @desc You will need it on pages where categories are needed lik in forum post page.
   * @desc It caches on memory.
   * @example
   *    wp.categories().subscribe(res => console.log('res: ', res));
   */
  categories(): Observable<Categories> {
    const k = 'categories';
    if (this.getCache(k)) {
      return of(this.getCache(k));
    }
    return this.http.get<Categories>(this.urlCategories, this.loginAuth).pipe(
      tap(data => this.setCache(k, data))
    );
  }



  sites(): Observable<Sites> {
    return this.http.get<Sites>(this.urlSonubApi + '/sites', this.loginAuth);
  }

  site(idx_site): Observable<Site> {
    return this.http.post<Site>(this.urlSonubApi + '/site', { idx_site: idx_site }, this.loginAuth);
  }


  createSite(data: Site): Observable<Site> {
    return this.http.post<Site>(this.urlSonubApi + '/create-site', data, this.loginAuth);
  }
  updateSite(form: Site): Observable<Site> {
    return this.http.post<Site>(this.urlSonubApi + '/update-site', form, this.loginAuth);
  }


  addDomain(data: DomainAdd): Observable<DomainAdd> {
    return this.http.post<DomainAdd>(this.urlSonubApi + '/add-domain', data, this.loginAuth);
  }
  deleteDomain(idx_domain: string): Observable<Site> {
    return this.http.post<Site>(this.urlSonubApi + '/delete-domain', { idx_domain: idx_domain }, this.loginAuth);
  }

}
