import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { Roles } from './roles.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private permissionsService: NgxPermissionsService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const requiredPermissions: string[] = route.data['permissions']['only'];
      console.log("requiredPermissions",route.data);
      // console.log(this.permissionsService.getPermission(Roles.MEMBERSHIP_USER));
      
    //  return this.permissionsService.hasPermission
      // Check if the user has the required permissions
      // this.permissionsService.add
      this.permissionsService.permissions$.subscribe((res:any)=>{
        console.log(res);
        
      })
      // return this.permissionsService.(requiredPermissions);
      return true;
  }
 
}
