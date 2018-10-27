# Sonub Wordpress Rest Api

Angular Wordpress Rest Api Extended for Sonub

## Initialization

* The service is provided in WordpressApiModule which means it will create a new instance if you do DI on each module/page.
  And this is a waste.
* So, DI only one time on app service or root service and share it to sub mdoules and pages.

* It is better to call `systemSettings()` as early as it can be since it is caching on memory, the next time you cal it, it own take time.
* It also caches in localStorage by default.

```` ts
  wp.systemSettings().subscribe(res => res, e => console.error(e));
````

## Dependencies

* ngx-cookie

## Testing

```` ts
  constructor(
    wpt: WordpressApiTestService
  ) {
    console.log('AppComponent::constructor()');
    wpt.run();
  }
````
