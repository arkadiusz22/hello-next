// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./auth/lucia.js").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email: string;
  };
  type DatabaseSessionAttributes = {};
}
