"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Newspaper } from "lucide-react";

import {
  summarizeSecurityArticle,
  type SummarizeSecurityArticleOutput,
} from "@/ai/flows/summarize-security-article";
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export default function ArticleSummarizerPage() {
  const [result, setResult] = useState<SummarizeSecurityArticleOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await summarizeSecurityArticle(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description:
          "Failed to summarize the article. The URL may be inaccessible or the content not readable.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Article Summarizer</CardTitle>
          <CardDescription>
            Get a quick, AI-powered summary of any online security article or
            blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/security-article"
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
                  <Newspaper />
                )}
                Summarize Article
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">Summary</h2>
        <Card className="min-h-[260px]">
          <CardHeader>
            <CardTitle>AI-Generated Summary</CardTitle>
            <CardDescription>
              Key points from the article are summarized below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="animate-spin" />
                <span>Generating summary...</span>
              </div>
            )}
            {result && (
              <p className="whitespace-pre-wrap">{result.summary}</p>
            )}
            {!isLoading && !result && (
              <p className="text-muted-foreground">
                Your article summary will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
