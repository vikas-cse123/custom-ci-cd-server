import "dotenv/config";
import express from "express";
import crypto from "crypto";
import { spawn } from "child_process";
const app = express();
const port = process.env.PORT;



app.use(express.json())
app.get("/",(req,res) => {
    res.end("Hi")
})

app.post("/github-webhook", (req, res) => {
  try {
    console.log("here");
    const githubSignature = req.headers["x-hub-signature-256"];
    const signature =
      "sha256=" +
      crypto
        .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");

    console.log({ signature, githubSignature });
    if (signature !== githubSignature) {
      return res.status(401).send("Invalid Signature");
    }
    res.json({ message: "ok" });
    console.log(req.body.repository.name);
    const script =
      req.body.repository.name === "cloudbox-frontend"
        ? "deploy-frontend.sh"
        : "deploy-backend.sh";
    console.log({ script });
    
    const bashChildProcess = spawn("bash", [`/Users/akash/Downloads/custom-ci-cd-sever/${script}`]);
    bashChildProcess.stdout.on("data", (data) => {
      process.stdout.write(data);
    });

    bashChildProcess.stderr.on("data", (data) => {
      process.stderr.write(data);
    });

    bashChildProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Script executed successfully");
      } else {
        console.log("Script failed");
      }
    });

    bashChildProcess.on("error", (err) => {
      res.json({ message: "ok" });
      console.log("Error in spawning the process");
      console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server started");
});
