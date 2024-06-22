"use client";

import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { emailSchema } from "@/validations/register";
import { Button } from "@/components/Button";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { Input } from "@/components/Input";
import { loginUser } from "@/services/authService";
import AuthLink from "@/components/AuthLink";

export default function Login() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <h1>Login</h1>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            try {
              const data = await loginUser(values);
              router.push("/dashboard");
            } catch (error: any) {
              setErrors({ email: error.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex w-full max-w-sm items-center space-x-2">
              <div>
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  placeholder="example@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                Send
              </Button>
            </Form>
          )}
        </Formik>
        <AuthLink
          text="Don't have an account?"
          linkText="Register"
          href="/auth/register"
        />
      </CardBody>
    </Card>
  );
}
