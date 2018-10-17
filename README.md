# angular-wordpress-api
Angular Wordpress Rest Api


## Example codes

```` typescript
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chance from 'chance';
import { AngularWordpressApiService, UserCreate, UserResponse, PostCreate } from './angular-wordpress-api/angular-wordpress-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // user: UserResponse;
  form: UserCreate = <any>{};
  post: PostCreate = <any>{};
  chance;
  posts;
  constructor(public wp: AngularWordpressApiService) {
    if (this.wp.isLogged) {
      this.wp.profile().subscribe(res => {
        console.log('user profile: ', res);
        this.form = <any>res;
      }, e => alert(e.message));
    }
  }


  onSubmitRegister() {
    if (this.wp.isLogged) {
      const data = {
        email: this.form.email,
        nickname: this.form.nickname
      };
      this.wp.updateProfile(data).subscribe(res => {
        console.log('chane user:', res);
      });

    } else {
      this.wp.register(this.form).subscribe(res => {
        alert('Register success!');
      });
    }
  }

  onSubmitPostCreate() {
    this.post.status = 'publish';
    this.wp.postCreate(this.post).subscribe(res => {
      console.log('create post: ', res);
    }, e => alert(e.message));
    return false;
  }
}
````
