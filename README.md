# Sonub Wordpress Rest Api

Angular Wordpress Rest Api Extended for Sonub

## Initialization

* The service is provided in WordpressApiModule which means it will create a new instance if you do DI on each module/page.
  And this is a waste.
* So, DI only one time on app service or root service and share it to sub mdoules and pages.

## Testing

```` ts
  constructor(
    wpt: WordpressApiTestService
  ) {
    console.log('AppComponent::constructor()');
    wpt.run();
  }
````
