import { useRouter } from "next/router";

import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { auth } from "../auth/lucia";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const Page = () => {
  const router = useRouter();
  return (
    <>
      <h1>Sign in</h1>
      <form
        method="post"
        action="/api/user/login"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const response = await fetch(e.currentTarget.action, {
            method: "POST",
            body: JSON.stringify({
              username: formData.get("username"),
              password: formData.get("password"),
            }),
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "manual",
          });

          if (response.status === 0 || response.ok) {
            router.push("/"); // redirect to profile page on success
          }
        }}
      >
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <input type="submit" />
      </form>
    </>
  );
};

export default Page;
