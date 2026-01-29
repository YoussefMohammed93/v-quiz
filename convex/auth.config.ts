export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
      applicationID: "convex",
    },
  ],
};
