class SocketService {
  sendMessage(socket, content, groupId, from = null, participant = null) {
    socket.to(`group:${groupId}`).emit("group:message", {
      content,
      groupId,
      from: from || socket.userId,
      participant,
      status: 0,
    });
  }
}
export default new SocketService();
