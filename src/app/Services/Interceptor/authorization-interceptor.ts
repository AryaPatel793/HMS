import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { inject } from '@angular/core';

export const AuthorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  console.log('Interceptor called');
  let modifiedRequest = req.clone({
    headers: req.headers
      .append('loggedEmail', userService.getUserEmail())
      .append('loggedRole', userService.getUserRole())
      .append('loggedUserName', userService.getUsername()),
  });
  return next(modifiedRequest);
};
