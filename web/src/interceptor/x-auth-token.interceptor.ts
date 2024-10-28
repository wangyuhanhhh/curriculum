import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class XAuthTokenInterceptor implements HttpInterceptor {
  /**
   * 从缓存中获取 x-auth-token，防止刷新后失效
   */
  private token = window.sessionStorage.getItem('x-auth-token');

  public static setToken(xAuthToken: string): void {
    if (xAuthToken) {
      window.sessionStorage.setItem('x-auth-token', xAuthToken);
    }
  }

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    // 如果 token 存在，克隆请求并将其添加到请求头中
    if (this.token !== null) {
      authReq = request.clone({
        setHeaders: {'x-auth-token': this.token}
      });
    }

    // 处理请求的响应，检查响应头中的新的 token
    return next.handle(authReq).pipe(
      tap(event => {
        // 只有当响应是 HttpResponse 类型时才处理（才可以从中获取到token）
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('x-auth-token');
          if (newToken) {
            // 如果响应头中包含新的 token，则更新缓存中的 token
            XAuthTokenInterceptor.setToken(newToken);
          }
        }
      })
    );
  }
}