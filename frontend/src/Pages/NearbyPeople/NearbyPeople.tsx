import PageHeader from "@/Components/PageHeader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useAppSelector } from "@/Hooks/redux";
import { socket } from "@/ws/socket";
import "leaflet/dist/leaflet.css";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import CustomMarker, { type CustomMarkerProps } from "./CustomMarker";
import EnableLocationAccess from "./EnableLocationAccess";
const positionOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 2000,
};
type NearbyPeopleLocationUpdateArgs = {
  userId: string;
  coords: L.LatLngExpression;
  userName?: string;
  fullName: string;
  profilePicture?: string;
};
const NearbyPeople = () => {
  const [isGeoLocationPermissionDenied, setIsGeoLocationPermissionDenied] =
    useState(true);
  // const [getIpLocation] =
  //   nearbyPeopleApiSlice.endpoints.getIpLocation.useLazyQuerySubscription({});
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [markers, setMarkers] = useState<{
    [key: string]: CustomMarkerProps;
  }>({});
  const [radius, setRadius] = useState("100");
  const currentUserMarker = useMemo(() => markers[user._id], [user, markers]);
  const updateMarker = useCallback(
    (
      userId: string,
      coords: L.LatLngExpression,
      fullName?: string,
      userName?: string,
      profilePicture?: string
    ) => {
      setMarkers((prev) => ({
        ...prev,
        [userId]: {
          latLng: coords,
          user: {
            userName,
            fullName,
            profilePicture,
          },
        },
      }));
    },
    []
  );
  const handleWatchPositionSuccess: PositionCallback = useCallback(
    (position) => {
      if (isGeoLocationPermissionDenied)
        setIsGeoLocationPermissionDenied(false);
      const { latitude, longitude } = position.coords;
      // update the user
      socket.emit("nearby_people:update", {
        coords: position.coords,
        radius,
      });

      updateMarker(
        user._id,
        [latitude, longitude],
        user.fullName,
        user.userName,
        user.profilePicture
      );
    },
    [
      radius,
      user,
      updateMarker,
      isGeoLocationPermissionDenied,
      setIsGeoLocationPermissionDenied,
    ]
  );
  const handleWatchPositionError: PositionErrorCallback = useCallback(
    (error) => {
      console.log(error);
      setIsGeoLocationPermissionDenied(error.PERMISSION_DENIED === 1);
    },
    [setIsGeoLocationPermissionDenied]
  );
  useLayoutEffect(() => {
    if ("geolocation" in navigator && !!user._id) {
      const watchId = navigator.geolocation.watchPosition(
        handleWatchPositionSuccess,
        handleWatchPositionError,
        positionOptions
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [handleWatchPositionSuccess, handleWatchPositionError]);

  useLayoutEffect(() => {
    // add the listeners if geo location access is provided
    if (!isGeoLocationPermissionDenied) {
      socket.on(
        "nearby_people:update",
        ({
          userId,
          fullName,
          profilePicture,
          userName,
          coords,
        }: NearbyPeopleLocationUpdateArgs) => {
          updateMarker(userId, coords, fullName, userName, profilePicture);
        }
      );
      socket.on(
        "nearby_people:list",
        (list: NearbyPeopleLocationUpdateArgs[]) => {
          // update the markers from the list of nearby people
          list.forEach(
            ({ userId, fullName, userName, profilePicture, coords }) => {
              updateMarker(userId, coords, fullName, userName, profilePicture);
            }
          );
        }
      );
      socket.on("nearby_people:disconnect", (userId) => {
        // delete the key value from marker object
        setMarkers((prev) => {
          const temp = { ...prev };
          if (!!prev[userId]) {
            delete temp[userId];
            return temp;
          }
          return prev;
        });
      });
      return () => {
        socket.off("nearby_people:update");
        socket.off("nearby_people:list");
        socket.off("nearby_people:disconnect");
        navigator.geolocation.getCurrentPosition((e) => {
          // emit the disconnect event to socket server
          socket.emit("nearby_people:disconnect", {
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
            radius,
          });
        });
      };
    }
  }, [isGeoLocationPermissionDenied, radius, updateMarker]);

  return (
    <div className="w-full h-screen flex flex-col">
      <PageHeader title="Nearby People" handleGoBack={() => navigate(-1)} />
      <div className="flex-1 relative">
        {!isGeoLocationPermissionDenied ? (
          <>
            <div className="absolute top-2 right-2 z-[999]">
              <Select
                onValueChange={(v) => {
                  setRadius(v);
                }}
                defaultValue={radius}
              >
                <SelectTrigger className="w-[96px] absolute right-1">
                  <SelectValue placeholder="radius" />
                </SelectTrigger>
                <SelectContent className="z-[999]" align="end">
                  <SelectGroup>
                    <SelectItem value="100">100m</SelectItem>
                    <SelectItem value="500">500m</SelectItem>
                    <SelectItem value="5000">5km</SelectItem>
                    <SelectItem value="10000">10km</SelectItem>
                    <SelectItem value="50000">50km</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {!!currentUserMarker && (
              <MapContainer
                center={currentUserMarker.latLng}
                zoom={16}
                scrollWheelZoom
                className="h-full"
              >
                <Circle
                  center={currentUserMarker.latLng}
                  pathOptions={{ opacity: 0.25 }}
                  radius={parseInt(radius)}
                />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.keys(markers)
                  .filter((m) => !!markers[m] && !!markers[m].user)
                  .map((m) => {
                    return (
                      <CustomMarker
                        key={m}
                        {...markers[m]}
                        currentUser={user._id}
                        userId={m}
                      />
                    );
                  })}
              </MapContainer>
            )}
          </>
        ) : (
          <EnableLocationAccess
            handleWatchPositionError={handleWatchPositionError}
            handleWatchPositionSuccess={handleWatchPositionSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default NearbyPeople;
