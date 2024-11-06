#### Hello

<!-- https://www.youtube.com/watch?v=oNsf8sx9Fdg -->

```bash
npm init -y
npx create-react-app client
cd client
npm install axios validator react-router-dom
npm install --save-dev @babel/plugin-proposal-private-property-in-object
npm run build
npm install -g serve
serve -s build

cd server
npm install express cookie-parser bcryptjs dotenv jsonwebtoken mongoose crypto react-router-dom body-parser 
# npm install mailtrap
npm i nodemon -D
# ex
# npm install swagger-ui-express express-openapi-validator 
# npm install --save-dev  swagger-jsdoc openapi-typescript @types/swagger-ui-express copyfiles
```



```bash
npm start
# on both /client and /server
```