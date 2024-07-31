# memeql-backend

This is the backend for MemeQL, described in a more overall sense here: https://github.com/memeql/memeql<br>

This frontend uses Express to deliver functionality for the MemeQL application. A number of Azure services are also used, their purpose will be described below. The backend provides different levels of CRUD to database collections containing information about memes, users, comments and blacklisted tokens (for signed out users).

Services used: 
DNS - Azure DNS
Web hosting - Azure Static Web Apps for frontend, App Service for backend
Unstructured data storage - Azure Blob Storage
MongoDB - Azure Cosmos DB, Mongo API
Email - Mailgun
Content moderation - Azure AI Content Safety (not yet implemented)

## Technical Notes

There are some defects that need to be addressed: 
1. Leftovers of the development scaffolding, including the Demo controller and routes.
2. The lead developer needs to spend some time on understanding how async works so that the url for an image is returned after image upload, not before.