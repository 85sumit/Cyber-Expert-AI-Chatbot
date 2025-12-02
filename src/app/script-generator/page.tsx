"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileCode, Loader2 } from "lucide-react";

import {
  generateSecurityScript,
  type GenerateSecurityScriptOutput,
} from "@/ai/flows/generate-security-script";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/code-block";

const formSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
});

export default function ScriptGeneratorPage() {
  const [result, setResult] = useState<GenerateSecurityScriptOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateSecurityScript(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description:
          "Failed to generate the script. Please check your input and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Script Generator</CardTitle>
          <CardDescription>
            Describe a security task, and our AI will generate a script to
            automate it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A Python script to scan for open ports on a local machine'."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileCode />
                )}
                Generate Script
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">
          Generated Script
        </h2>
        {isLoading && (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {result && result.script && <CodeBlock code={result.script} />}

        {!isLoading && !result && (
          <Card className="flex h-64 flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Waiting for input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your generated script will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
