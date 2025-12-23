import { useState } from "react";
import { Api } from "@/services/Api";
import useStore from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function APITest() {
  const { user } = useStore();
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(false);

  const testAPI = async () => {
    setApiLoading(true);
    setApiResponse("");

    const response = await Api.get("/api/v1/users/me").catch((e) => ({
      error: e,
    }));

    if (response.error) {
      setApiResponse(`❌ API Error: ${response.error}`);
    } else {
      setApiResponse(`✅ API Success: ${JSON.stringify(response, null, 2)}`);
    }

    setApiLoading(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">API Auth</CardTitle>
        <CardDescription className="text-zinc-400">
          Test authentication against API server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testAPI}
          disabled={!user || apiLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {apiLoading ? "Testing..." : "Test API"}
        </Button>

        {!user && (
          <p className="text-zinc-400 text-sm">Sign in to test the API</p>
        )}

        {apiResponse && (
          <div className="p-4 bg-zinc-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">API Response</h3>
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
              {apiResponse}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
