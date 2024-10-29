import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {User} from '../app/entity/user';
import {tap} from 'rxjs/operators';
import {ResponseBody} from '../app/entity/response-body';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = '/api/login';
  currentUser = new ReplaySubject<User>(1);

  setCurrentUser(user: User): void {
    this.currentUser.next(user);
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  currentLoginUser(): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(`${this.baseUrl}/currentLoginUser`).pipe(tap(value => {
      let user;
      if (typeof value.data === 'string') {
        user = JSON.parse(value.data) as User;
      }
      user = value.data as User;
      this.setCurrentUser(user);
    }));
  }

  login(username: string, password: string): Observable<HttpResponse<ResponseBody>> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<any>(`${this.baseUrl}/login`, body.toString(), {
      // 设置请求头的格式，使得后台可以正常获取到头部的 username 和 password
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      observe: 'response' // 设置 observe 为 response 以获取完整的响应对象
    }).pipe(tap( response => {
      const user = JSON.parse(response.body.data) as User;
      this.setCurrentUser(user);
    }));
  }

  // 登出
  logout(): Observable<ResponseBody> {
    return this.http.post<ResponseBody>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        // 成功后，清除本地的 sessionStorage 中的 x-auth-token
        sessionStorage.removeItem('x-auth-token');
      })
    );
  }
}
