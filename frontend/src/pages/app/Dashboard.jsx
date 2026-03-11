import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import useAuth from "../../context/useAuth";

export default function Dashboard() {

  const { user } = useAuth();

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  const openWebsite = (url) => window.open(url, "_blank");

  const branches = [
    {
      root: "General AI Assistants",
      tools: [
        { name: "ChatGPT", url: "https://chat.openai.com" },
        { name: "Gemini", url: "https://gemini.google.com" },
        { name: "Claude", url: "https://claude.ai" },
        { name: "Perplexity", url: "https://perplexity.ai" }
      ]
    },
    {
      root: "AI Writing Tools",
      tools: [
        { name: "Jasper", url: "https://jasper.ai" },
        { name: "Copy.ai", url: "https://copy.ai" },
        { name: "Writesonic", url: "https://writesonic.com" },
        { name: "QuillBot", url: "https://quillbot.com" }
      ]
    },
    {
      root: "AI Image Generation",
      tools: [
        { name: "Midjourney", url: "https://midjourney.com" },
        { name: "DALL·E", url: "https://openai.com/dall-e" },
        { name: "Stable Diffusion", url: "https://stability.ai" },
        { name: "Firefly", url: "https://firefly.adobe.com" }
      ]
    },
    {
      root: "AI Video Creation",
      tools: [
        { name: "Runway", url: "https://runwayml.com" },
        { name: "Synthesia", url: "https://synthesia.io" },
        { name: "Pika", url: "https://pika.art" },
        { name: "Sora", url: "https://openai.com/sora" }
      ]
    },
    {
      root: "AI Coding Tools",
      tools: [
        { name: "Copilot", url: "https://github.com/features/copilot" },
        { name: "Cursor", url: "https://cursor.sh" },
        { name: "Replit", url: "https://replit.com" },
        { name: "Amazon Q", url: "https://aws.amazon.com/q" }
      ]
    },
    {
      root: "AI Productivity",
      tools: [
        { name: "Notion AI", url: "https://notion.so" },
        { name: "Otter", url: "https://otter.ai" },
        { name: "Canva AI", url: "https://canva.com" },
        { name: "Docs AI", url: "https://workspace.google.com" }
      ]
    }
  ];

  const models = [
    { name: "GPT-4", url: "https://openai.com" },
    { name: "Claude 3", url: "https://claude.ai" },
    { name: "Gemini", url: "https://deepmind.google/technologies/gemini/" },
    { name: "LLaMA 3", url: "https://ai.meta.com/llama/" },
    { name: "Mistral", url: "https://mistral.ai" },
    { name: "DeepSeek", url: "https://deepseek.com" },
    { name: "Ollama", url: "https://ollama.com" }
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 pb-40 space-y-24 min-h-screen text-[#38BDF8]">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 relative z-10">

        <h1 className="text-5xl font-bold tracking-wide text-[#22D3EE]">
          AI HUB
        </h1>

        <p className="text-xl text-[#3B82F6]">
          Your Intelligent Workspace
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg"
        >
          {greeting}{" "}
          <span className="text-[#22D3EE] text-xl font-semibold">
            {user?.name || "User"}
          </span>
        </motion.p>

      </div>

      {/* TOOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">

        {branches.map((branch, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center space-y-6"
          >

            <div className="flex flex-col items-center relative">

              <Tool tool={branch.tools[0]} openWebsite={openWebsite} />

              <NeuralLine vertical />

              <div className="flex items-center gap-2 relative">

                <Tool tool={branch.tools[1]} openWebsite={openWebsite} />

                <NeuralLine />

                <div className="text-xs text-[#22D3EE] px-3 font-semibold relative">

                  {branch.root}

                  <motion.div
                    className="absolute inset-0 rounded-md border border-[#22D3EE]/40"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                </div>

                <NeuralLine />

                <Tool tool={branch.tools[2]} openWebsite={openWebsite} />

              </div>

              <NeuralLine vertical />

              <Tool tool={branch.tools[3]} openWebsite={openWebsite} />

            </div>

          </motion.div>

        ))}

      </div>

      {/* MODELS */}
      <div className="space-y-12 relative z-10">

        <h2 className="text-3xl font-semibold flex items-center justify-center gap-2 text-[#22D3EE]">
          <Bot className="text-[#3B82F6]" />
          AI Models
        </h2>

        <div className="flex flex-wrap justify-center gap-6">

          {models.map((model, i) => (

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{
                scale: 1.15,
                boxShadow: "0 0 25px #38BDF8"
              }}
              onClick={() => openWebsite(model.url)}
              className="cursor-pointer px-6 py-3 rounded-full border border-[#38BDF8]/40 bg-white/5"
            >
              {model.name}
            </motion.div>

          ))}

        </div>

      </div>

    </div>
  );
}


/* TOOL NODE */

function Tool({ tool, openWebsite }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => openWebsite(tool.url)}
      className="cursor-pointer text-xs px-4 py-2 rounded-md border border-[#38BDF8]/40 bg-white/5 backdrop-blur-sm relative text-[#38BDF8]"
    >
      {tool.name}

      <motion.div
        className="absolute inset-0 rounded-md bg-[#22D3EE]/10"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

    </motion.div>
  );
}


/* REALISTIC NEURAL LINE */

function NeuralLine({ vertical }) {

  return (
    <div
      className={`relative ${
        vertical ? "h-8 w-[2px]" : "w-10 h-[2px]"
      } bg-[#3B82F6]/40 rounded-full overflow-hidden`}
    >

      <motion.div
        className={`absolute ${
          vertical ? "w-[2px] h-8" : "h-[2px] w-10"
        } bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent blur-[1px]`}
        animate={
          vertical
            ? { y: [-30, 50] }
            : { x: [-40, 80] }
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

    </div>
  );
}