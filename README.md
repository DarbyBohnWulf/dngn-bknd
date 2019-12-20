# DngnBddy
## dngn-frnt

### What is it?

DngnBddy is comprised of a Node.js powered Express/MongoDB+GraphQL
[backend](https://github.com/DarbyBohnWulf/dngn-bknd) and a React.js 
frontend that, together, assist users through the D&D 5E character 
creation process. Trying new things can be scary, so bring a
Bddy!:wink:

### Who made this?

Me, Mark! I made this. Using skills I've gained over the years and honed over 3 months in General Assembly's Software Engineering Immersive. Hacking on this project has called on every tool in my toolboox and caused me to pick up a few more along the way.

### Why did you do that?

Well, roleplaying games of every medium hold a dear place in my heart,
and I know that's true for many people. So why not apply some elbow
grease and brain oil to try to bring something potentially useful to 
the community. DM me about joining your pick-up session!

### How do you do it?

It started with an `npm init` and I took off from there. First, I set
up the backend server to serve as a standalone API using express,
mongoose, graphql-compose-mongoose and apollo-server-express. That was
the first because React is most fun with a database to actually talk
to. Building a GraphQL API is a bit different from building a RESTful
API, but once you get over the first couple of bumps, you'll never
want to turn back.
Next came create-react-app and apollo-boost to take care of all 
the client-side action. I've used React a time or two before, but this
time I took the opportunity to dive deep into React Hooks, and this
repo features 100% functional components. Farewell class components, we
hardly knew ye. I also took this opportunity to look into the guts of
React using TypeScript to force me to think hard about exactly what my
functions are returning and why.

### No, where do I go to start using it?

Oh, well. You can click the link at the top of this repo to be taken to
a live version of the app running on Heroku and MongoDB Atlas. Or, if
you want to hoard all the fun for yourself (or maybe share a merge),
just clone (after forking, if you're feeling hackerish) this repo and 
[dngn-bknd](https://github.com/DarbyBohnWulf/dngn-bknd), run a cool
`npm i` followed by an `npm start` in 'dngn-bknd' and 'dngn-frnt' each,
and you should be good to go.
