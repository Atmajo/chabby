import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = () => {
  const user = useUser();
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user.user?.imageUrl} />
      <AvatarFallback>{user.user?.fullName?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
