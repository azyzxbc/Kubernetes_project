// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    //base_url: 'https://8b95-41-62-85-150.ngrok-free.app',
    base_url: 'http://api_cvex:8000',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    base_url_linkedin: 'https://2992-197-3-68-150.ngrok-free.app',
    login : 'admin@admin.com',
    password: 'admin',
    firstDashboard: 'https://abshore-recrutement-dashboards.matchnhire.com/public/dashboard/340269c0-5da3-442b-a19c-eea232532425?',
    secondDashboard: 'https://abshore-recrutement-dashboards.matchnhire.com/public/dashboard/8fd3122b-a3c9-4740-b38e-fffbf35caea7?',
    thirdDashboard: 'https://abshore-recrutement-dashboards.matchnhire.com/public/dashboard/ab4e4d26-75e2-4f95-b4f7-df34e661b5d8?',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
