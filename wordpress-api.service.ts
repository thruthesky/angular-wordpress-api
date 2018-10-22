import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {
  WordpressApiConfig, UserCreate, UserResponse, UserUpdate, PostCreate, WordpressApiError, Categories, Post, Posts
} from './wordpress-api.interface';



@Injectable()
export class WordpressApiService {

  static config: WordpressApiConfig = null;

  constructor(
    private http: HttpClient
  ) {
    console.log('WordpressApiConfig: config: ', this.config);
  }



  /**
   * Returns Error object.
   * @param e 400 (Bad Request) from Wordpress
   */
  isError(e) {
    if (e && e.error && e.error.code) {
      return true;
    } else {
      return false;
    }
  }

  getError(e): WordpressApiError {
    if (this.isError(e)) {
      return { code: e.error.code, message: e.error.message };
    } else {
      return null;
    }
  }

  get config(): WordpressApiConfig { return WordpressApiService.config; }
  get url(): string { return this.config.url; }
  get urlWordpressApiEndPoint(): string { return this.url + '/wp-json/wp/v2'; }
  get urlUsers(): string { return this.urlWordpressApiEndPoint + '/users'; }
  get urlPosts(): string { return this.urlWordpressApiEndPoint + '/posts'; }
  get urlCategories(): string { return this.urlWordpressApiEndPoint + '/categories'; }


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
  profile(auth?) {
    if (!auth) {
      auth = this.loginAuth;
    }
    return this.http.get<UserResponse>(this.url + '/wp-json/custom/api/profile', auth).pipe(
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

  /**
   * Gets categories.
   * @desc Use this method to know categories. You will need it on forum post page.
   * @example
   *    wp.getCategories().subscribe(res => console.log('res: ', res));
   */
  getCategories() {
    return this.http.get<Categories>(this.urlCategories, this.loginAuth);
  }


}
