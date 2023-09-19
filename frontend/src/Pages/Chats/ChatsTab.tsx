import { AnimatePresence, motion } from "framer-motion";
import Group from "../../Components/Group/Group";
import GroupSkeleton from "../../Components/Group/GroupSkeleton";
import { useAppDispatch } from "../../Hooks/redux";
import { useGetInboxListQuery } from "./chatApiSlice";
import { setCurrentInbox } from "./chatSlice";

const ChatsTab = () => {
  const { data: inboxList, isLoading, isSuccess } = useGetInboxListQuery({});
  const dispatch = useAppDispatch();
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="inbox-skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array(6)
            .fill(null)
            .map((value, index) => (
              <GroupSkeleton key={`inbox-skeleton-${index}`} />
            ))}
        </motion.div>
      )}
      {isSuccess && (
        <motion.div
          key="inbox-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          {inboxList &&
            inboxList?.length > 0 &&
            inboxList
              ?.filter((item) => item.participant)
              ?.map((item) => {
                return (
                  <Group
                    onClick={() => {
                      dispatch(
                        setCurrentInbox({
                          groupId: item.group,
                          inboxId: item.inboxId,
                          participant: item.participant,
                          unreadMessageCount: item.unreadMessageCount,
                        })
                      );
                    }}
                    key={item.participant?._id}
                    {...item}
                  />
                );
              })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatsTab;
