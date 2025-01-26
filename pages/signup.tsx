import { useRouter } from "next/router";

import Link from "next/link";

const Page = () => {
  const router = useRouter();
  return (
    <>
      <h1>Sign up</h1>
      <form
        method="post"
        action="/api/user/signup"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const response = await fetch(e.currentTarget.action, {
            method: "POST",
            body: JSON.stringify({
              username: formData.get("username"),
              password: formData.get("password"),
              email: formData.get("email"),
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
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <input type="submit" />
      </form>
      <Link href="/login">Sign in</Link>
    </>
  );
};

export default Page;
