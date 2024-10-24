import { requireUser } from "~/lib/user-helper.server";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useToast } from "app/hooks/use-toast";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  requireUser(request, context);
  return null;
};

export default function Protected() {
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    paymentMethod: z.enum(["credit-card", "paypal", "apple-pay", "google-pay"]),
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, { message: "Card number must be 16 digits." })
      .optional(),
    expiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: "Expiry date must be in MM/YY format.",
      })
      .optional(),
    cvc: z
      .string()
      .regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits." })
      .optional(),
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      paymentMethod: "credit-card",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Purchase successful!",
        description: "Your digital goods are ready for download.",
      });
      console.log(values);
    }, 2000);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you~example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="credit-card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <CreditCard className="w-4 h-4 inline-block mr-2" />
                              Credit Card
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paypal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <Wallet className="w-4 h-4 inline-block mr-2" />
                              PayPal
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="apple-pay" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <Smartphone className="w-4 h-4 inline-block mr-2" />
                              Apple Pay
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="google-pay" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <Smartphone className="w-4 h-4 inline-block mr-2" />
                              Google Pay
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchPaymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Premium E-book Bundle</span>
                <span>$29.99</span>
              </div>
              <div className="flex justify-between">
                <span>Video Course Access (1 year)</span>
                <span>$49.99</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$79.98</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Your digital goods will be available for immediate download after
              purchase.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
