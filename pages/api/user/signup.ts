import { auth } from "../../../auth/lucia";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405);
  const { username, password, email } = req.body as {
    username: unknown;
    password: unknown;
    email: unknown;
  };
  // basic check
  if (
    typeof username !== "string" ||
    username.length < 4 ||
    username.length > 31
  ) {
    return res.status(400).json({
      error: "Invalid username",
    });
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return res.status(400).json({
      error: "Invalid password",
    });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      error: "Invalid password",
    });
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        name: username.toLowerCase(),
        email: email,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest({
      req,
      res,
    });
    authRequest.setSession(session);
    return res.redirect(302, "/"); // profile page
  } catch (e) {
    // TODO
    // this part depends on the database you're using
    // check for unique constraint error in user table
    // if (
    //   e instanceof SomeDatabaseError &&
    //   e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR
    // )
    //  {
    //   return res.status(400).json({
    //     error: "Username already taken",
    //   });
    // }

    return res.status(500).json({
      error: "An unknown error occurred",
    });
  }
};

export default handler;
