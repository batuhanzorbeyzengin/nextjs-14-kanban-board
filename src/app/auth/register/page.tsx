"use client";

import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { emailSchema } from "@/validations/register";
import { Button } from "@/components/Button";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { Input } from "@/components/Input";
import { registerUser } from "@/services/authService";
import AuthLink from "@/components/AuthLink";

export default function Register() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <h1>Register</h1>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            try {
              const data = await registerUser(values);
              router.push("/auth/login");
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
                Register
              </Button>
            </Form>
          )}
        </Formik>
        <AuthLink
          text="Already have an account?"
          linkText="Login"
          href="/auth/login"
        />
      </CardBody>
    </Card>
  );
}
