// src/app/summary-engine/custom-reuse-strategy.ts

import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log('CustomReuseStrategy: shouldDetach called for route', route);
    return false;  // Don't allow detaching route
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    console.log('CustomReuseStrategy: store called for route', route);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log('CustomReuseStrategy: shouldAttach called for route', route);
    return false; // Don't allow attaching cached route
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    console.log('CustomReuseStrategy: retrieve called for route', route);
    return null; // No cached routes to retrieve
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const reuse = future.routeConfig === curr.routeConfig && future.params['id'] === curr.params['id'];
    console.log(`CustomReuseStrategy: shouldReuseRoute - reuse: ${reuse}`);
    return reuse;
  }
}

