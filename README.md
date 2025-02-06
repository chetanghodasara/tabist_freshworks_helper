## Your First App

This app displays the name of the requester of a freshdesk ticket in the ticket_sidebar placeholder

### Files and Folders

    .
    ├── README.md                 A file for your future self and developer friends to learn about app
    ├── app                       A folder to place all assets required for frontend components
    │   ├── index.html            A landing page for the user to use the app
    │   ├── scripts               JavaScript to place files frontend components business logic
    │   │   └── app.js
    │   └── styles                A folder to place all the styles for app
    │       ├── images
    │       │   └── icon.svg
    │       └── style.css
    ├── config                    A folder to place all the configuration files
    │   └── iparams.json
    └── manifest.json             A JSON file holding meta data for app to run on platform

Explore [more of app sample apps](https://community.developers.freshworks.com/t/freshworks-sample-apps/3604) on the Freshworks github respository.

### How to run the app

#### Install Prerequisites

- [Install Node.js](https://developers.freshworks.com/docs/app-sdk/v3.0/common/app-development-process/#install-prerequisites)
- [Install FDK](https://developers.freshworks.com/docs/app-sdk/v3.0/common/app-development-process/#install-the-fdk-+-cli)

#### Set config and run app

```
fdk config set --scope local global_apps.enabled true
fdk run
```

[Reference](https://developers.freshworks.com/docs/app-sdk/v3.0/common/app-development-process/#create-an-app)

Now you can see the app in the ticket sidebar of the ticket details page in freshdesk.

e.g:
https://domain.freshdesk.com/a/tickets/1?dev=true
