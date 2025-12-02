"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, Loader2, ScanLine } from "lucide-react";

import {
  identifyVulnerabilities,
  type IdentifyVulnerabilitiesOutput,
} from "@/ai/flows/identify-vulnerabilities";
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
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  codeSnippet: z
    .string()
    .min(50, { message: "Code snippet must be at least 50 characters." })
    .max(5000, { message: "Code snippet must not exceed 5000 characters." }),
  language: z
    .string()
    .min(1, { message: "Please specify the programming language." }),
});

export default function VulnerabilityScannerPage() {
  const [result, setResult] = useState<IdentifyVulnerabilitiesOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeSnippet: "",
      language: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await identifyVulnerabilities(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description:
          "Failed to analyze the code. Please check your input and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vulnerability Scanner</CardTitle>
          <CardDescription>
            Analyze a code snippet for potential security vulnerabilities using
            AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="codeSnippet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Snippet</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your code snippet here..."
                        className="min-h-[250px] font-code text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programming Language</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Python, JavaScript, Java"
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
                  <ScanLine />
                )}
                Scan Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">
          Analysis Results
        </h2>
        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Loader2 className="mr-2 inline-block animate-spin" />
                Analyzing...
              </CardTitle>
              <CardDescription>
                Our AI is scanning your code for vulnerabilities. Please wait.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>
            </CardContent>
          </Card>
        )}

        {result &&
          (result.vulnerabilities.length > 0 ||
            result.suggestions.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Scan Complete</CardTitle>
                <CardDescription>
                  Review the identified vulnerabilities and suggestions below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="vulnerabilities">
                    <AccordionTrigger className="text-lg font-semibold">
                      Vulnerabilities ({result.vulnerabilities.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-5">
                        {result.vulnerabilities.map((vuln, i) => (
                          <li key={`vuln-${i}`}>{vuln}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="suggestions">
                    <AccordionTrigger className="text-lg font-semibold">
                      Suggestions ({result.suggestions.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-5">
                        {result.suggestions.map((sug, i) => (
                          <li key={`sug-${i}`}>{sug}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

        {result &&
          result.vulnerabilities.length === 0 &&
          result.suggestions.length === 0 && (
            <Alert variant="default" className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/50">
              <AlertTriangle className="h-4 w-4 !text-green-500" />
              <AlertTitle className="font-headline">No Vulnerabilities Found</AlertTitle>
              <AlertDescription>
                Our AI analysis did not find any common vulnerabilities in the
                provided code snippet.
              </AlertDescription>
            </Alert>
          )}

        {!isLoading && !result && (
          <Card className="flex h-64 flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Waiting for input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your scan results will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
