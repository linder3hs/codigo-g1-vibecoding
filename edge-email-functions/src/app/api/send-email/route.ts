import { Resend } from "resend";

export async function POST() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data } = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: process.env.EMAIL_TO as string,
    subject: "Testing edge function",
    text: `Test function to ${process.env.EMAIL_TO}`,
  });

  console.log(data);

  return Response.json({
    message: "Email enviado",
    emailId: data?.id,
  });
}
