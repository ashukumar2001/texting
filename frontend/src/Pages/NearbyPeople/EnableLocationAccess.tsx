import { Button } from "@/Components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/Components/ui/card";
interface EnableLocationAccessProps {
  handleWatchPositionSuccess: PositionCallback;
  handleWatchPositionError: PositionErrorCallback;
}
export default function EnableLocationAccess({
  handleWatchPositionSuccess,
  handleWatchPositionError,
}: EnableLocationAccessProps) {
  return (
    <div className="w-full h-full grid place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enable Location Access</CardTitle>
          <CardDescription>
            To use this feature, you have to enable your location. This will
            allow us to find nearby peoples.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            className="w-full"
            onClick={() => {
              navigator.geolocation.watchPosition(
                handleWatchPositionSuccess,
                handleWatchPositionError
              );
            }}
          >
            Grant Location Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
