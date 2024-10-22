import { mailTrapClient, sender } from '../lib/mailtrap.js';
import {
  createCommentNotificationEmailTemplate,
  createWelcomeEmailTemplate,
  createConnectionAcceptedEmailTemplate,
} from './emailTemplates.js';

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Welcom to ClonedLinked',
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: 'welcome',
    });

    console.log('welcome email sent successfully ', response);
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ email: recipientEmail }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: 'New comment on your post',
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: 'comment_notification',
    });
    console.log('notification sent successfully: ', response);
  } catch (error) {
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipient = [{ email: senderEmail }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: 'connection_accepted',
    });
  } catch (error) {}
};
