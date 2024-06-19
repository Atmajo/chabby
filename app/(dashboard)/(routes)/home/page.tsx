"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectValue } from "@/components/ui/select";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UserButton, UserProfile } from "@clerk/nextjs";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

interface Message {
  text: string;
  role: string;
  timeStamp: Date;
}

export default function Home() {
  const [message, setMessage] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("light");

  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const {
    toast,
  }: { toast: (options: { title: string; description: string }) => void } =
    useToast();

  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY || ""
  );

  const MODEL_NAME = "gemini-1.5-flash";

  const generationConfig = {
    maxOutputTokens: 524,
    topK: 1,
    topP: 1,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const formSchema = z.object({
    theme: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const initiateChat = async () => {
      try {
        const newChat = genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            safetySettings,
            generationConfig,
          });
        setChat(newChat);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to initiate chat",
        });
      }
    };

    initiateChat();
  }, []);

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timeStamp: new Date(),
      };
      setMessage((prev) => [...prev, userMessage]);
      setUserInput("");

      if (chat) {
        const result = await chat.sendMessage(userInput);
        const botMessage = {
          text: result.response.text(),
          role: "bot",
          timeStamp: new Date(),
        };
        setMessage((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (data: z.infer<typeof formSchema>) => {
    setTheme(data.theme);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userInput.length > 0) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [message]);
  
  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          background: "bg-white",
          playground: "bg-gray-300",
          text: "text-black",
          select: "bg-gray-300",
          Loader: "text-black",
        };
      case "dark":
        return {
          background: "bg-slate-800",
          playground: "bg-white/10",
          text: "text-white",
          button: "bg-gray-400",
          loader: "text-white",
          select: "bg-white/20",
        };
      default:
        return {
          background: "bg-white",
          playground: "bg-gray-300",
          text: "text-black",
          select: "bg-gray-300",
          Loader: "text-black",
        };
    }
  };

  const { background, text, button, playground, loader, select } =
    getThemeColors();

  return (
    <div className={cn("flex flex-col h-[92vh] md:h-screen p-4", background)}>
      <div className={cn("flex justify-between items-center mb-4")}>
        <h1 className={cn("text-2xl font-bold text-black", text)}>Chabby</h1>
        <div className="flex justify-center items-center gap-x-4">
          <Form {...form}>
            <form onChange={form.handleSubmit(handleThemeChange)}>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        setTheme(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={cn("outline-none w-24", select)}
                      >
                        <SelectValue placeholder="Light" />
                      </SelectTrigger>
                      <SelectContent
                        className={cn("outline-none w-24", select)}
                      >
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div
        ref={chatEndRef}
        className={cn("flex-1 overflow-y-auto rounded-md p-2", playground)}
      >
        <div className="">
          {message.map((msg, index) => (
            <div key={index} className="flex flex-col mb-4">
              <div className="flex justify-start gap-x-2">
                {msg.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <span className={cn("rounded-lg", text)}>{msg.text}</span>
              </div>
              {isLoading &&
                msg.role === "user" &&
                index === message.length - 1 && (
                  <div className="mt-2">
                    <Loader color={loader} />
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          placeholder="Type your message"
          value={userInput}
          disabled={isLoading}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 rounded-md border text-black focus:outline-none focus:border-gray-900"
        />
        <Button
          onClick={handleSendMessage}
          disabled={userInput.length === 0}
          className={cn(
            "p-2 rounded-md hover:bg-opacity-80 focus:outline-none",
            button
          )}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
