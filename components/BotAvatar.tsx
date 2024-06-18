import { BotIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = () => {
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src="/bot.svg" />
      <AvatarFallback>Bot</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
