import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";

import { prismaClient } from "../lib/prismaClient";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import { auth } from "../auth/lucia";
import { useRouter } from "next/router";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    userId: string;
    username: string;
    feed: PostProps[];
  }>
> => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // const feed = await prismaClient.post.findMany({
  //   where: { published: true },
  //   include: {
  //     author: {
  //       select: { name: true },
  //     },
  //   },
  // });

  return {
    props: {
      userId: session.user.userId,
      username: session.user.name,
      feed: [],
    },
  };
};

const Blog = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  return (
    <Layout>
      <div className="page">
        <main>
          <section>
            <p>User id: {props.userId}</p>
            <p>Username: {props.username}</p>
            <form
              method="post"
              action="/api/user/logout"
              onSubmit={async (e) => {
                e.preventDefault();
                const response = await fetch("/api/user/logout", {
                  method: "POST",
                  redirect: "manual",
                });
                if (response.status === 0 || response.ok) {
                  router.push("/login"); // redirect to login page on success
                }
              }}
            >
              <input type="submit" value="Sign out" />
            </form>
          </section>

          <h1>Public Feed</h1>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
