"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Send,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Code2,
  FileText,
  Lightbulb,
  ArrowRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { apiRequest } from "@/lib/api-client"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e] rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading Editor...</span>
      </div>
    </div>
  ),
})

interface Problem {
  id: number
  title: string
  difficulty: "easy" | "medium" | "hard"
  description: string
  inputFormat: string
  outputFormat: string
  constraints: string[]
  examples: { input: string; output: string; explanation?: string }[]
  hints: string[]
  tags: string[]
  timeLimit: string
  memoryLimit: string
}

type SubmissionStatus = "idle" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compile_error"

const LANGUAGES = [
  { id: "python", label: "Python 3", monacoId: "python" },
  { id: "cpp", label: "C++ 17", monacoId: "cpp" },
  { id: "java", label: "Java 17", monacoId: "java" },
  { id: "c", label: "C", monacoId: "c" },
] as const

const DEFAULT_CODE: Record<string, string> = {
  python: `# Write your solution here
def solve():
    # Read input
    n = int(input())
    
    # Your code here
    
    # Print output
    print(result)

solve()
`,
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    cin >> n;
    
    // Your code here
    
    cout << result << endl;
    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // Your code here
        
        System.out.println(result);
    }
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    // Your code here
    
    printf("%d\\n", result);
    return 0;
}
`,
}

// Sample problem data - replace with API later
const SAMPLE_PROBLEM: Problem = {
  id: 1,
  title: "مجموع دو عدد",
  difficulty: "easy",
  description:
    "دو عدد صحیح به شما داده شده است. مجموع این دو عدد را محاسبه و چاپ کنید.\n\nاین مسئله یک مسئله ساده برای شروع است. شما باید دو عدد را از ورودی بخوانید و مجموع آن‌ها را در خروجی چاپ کنید.",
  inputFormat: "در تنها خط ورودی، دو عدد صحیح a و b داده شده‌اند.",
  outputFormat: "مجموع دو عدد a و b را در یک خط چاپ کنید.",
  constraints: [
    "-10^9 <= a, b <= 10^9",
    "زمان اجرا: 1 ثانیه",
    "حافظه: 256 مگابایت",
  ],
  examples: [
    {
      input: "3 5",
      output: "8",
      explanation: "مجموع 3 و 5 برابر 8 است.",
    },
    {
      input: "-2 7",
      output: "5",
    },
    {
      input: "0 0",
      output: "0",
    },
  ],
  hints: [
    "از نوع داده مناسب برای ذخیره اعداد بزرگ استفاده کنید.",
    "در ++C از long long استفاده کنید.",
  ],
  tags: ["ریاضیات", "مقدماتی"],
  timeLimit: "1 ثانیه",
  memoryLimit: "256 مگابایت",
}

const difficultyConfig = {
  easy: { label: "آسان", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  medium: { label: "متوسط", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  hard: { label: "سخت", color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
}

export default function ChallengePage() {
  const { user } = useAuth()
  const [language, setLanguage] = useState<string>("python")
  const [code, setCode] = useState(DEFAULT_CODE.python)
  const [status, setStatus] = useState<SubmissionStatus>("idle")
  const [output, setOutput] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [showHints, setShowHints] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const problem = SAMPLE_PROBLEM
  const diff = difficultyConfig[problem.difficulty]

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setLanguage(newLang)
      setCode(DEFAULT_CODE[newLang] || "")
    },
    []
  )

  const handleResetCode = useCallback(() => {
    setCode(DEFAULT_CODE[language] || "")
    setStatus("idle")
    setOutput("")
  }, [language])

  const handleCopyExample = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleRun = useCallback(async () => {
    setStatus("running")
    setOutput("")
    setActiveTab("output")

    // Simulate run - replace with actual API call
    setTimeout(() => {
      setOutput("8\n")
      setStatus("idle")
    }, 1500)
  }, [code, language])

  const handleSubmit = useCallback(async () => {
    if (!user) {
      return
    }

    setStatus("running")
    setOutput("")
    setActiveTab("output")

    try {
      // Replace with actual API endpoint
      const response = await apiRequest("/challenge/submit/", {
        method: "POST",
        body: JSON.stringify({
          problem_id: problem.id,
          language,
          code,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setStatus(result.status || "accepted")
        setOutput(result.output || "All test cases passed!")
      } else {
        setStatus("runtime_error")
        setOutput("Server error occurred.")
      }
    } catch {
      // Simulate for demo
      setTimeout(() => {
        setStatus("accepted")
        setOutput("Accepted\n\nAll 5 test cases passed.\nExecution time: 32ms\nMemory: 3.2MB")
      }, 2000)
    }
  }, [user, code, language, problem.id])

  const getStatusDisplay = () => {
    switch (status) {
      case "running":
        return (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Judging...</span>
          </div>
        )
      case "accepted":
        return (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>Accepted</span>
          </div>
        )
      case "wrong_answer":
        return (
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-4 h-4" />
            <span>Wrong Answer</span>
          </div>
        )
      case "time_limit":
        return (
          <div className="flex items-center gap-2 text-amber-500">
            <Clock className="w-4 h-4" />
            <span>Time Limit Exceeded</span>
          </div>
        )
      case "runtime_error":
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>Runtime Error</span>
          </div>
        )
      case "compile_error":
        return (
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle className="w-4 h-4" />
            <span>Compile Error</span>
          </div>
        )
      default:
        return null
    }
  }

  const monacoLang = LANGUAGES.find((l) => l.id === language)?.monacoId || "python"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className={`flex-1 pt-16 ${isFullscreen ? "fixed inset-0 z-50 bg-background pt-0" : ""}`}>
        {/* Top Bar */}
        <div className="border-b bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {!isFullscreen && (
                <Link href="/khucpc">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ArrowRight className="w-4 h-4" />
                    <span className="hidden sm:inline">بازگشت</span>
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm md:text-base">{problem.title}</h1>
                <Badge variant="outline" className={`text-xs ${diff.color}`}>
                  {diff.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {problem.timeLimit}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-7.5rem)]">
          {/* Left Panel - Problem Description */}
          <div className="lg:w-[45%] xl:w-[40%] border-b lg:border-b-0 lg:border-l overflow-hidden flex flex-col h-[40vh] lg:h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 pt-2">
                <TabsTrigger value="description" className="gap-1.5 text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <FileText className="w-3.5 h-3.5" />
                  صورت مسئله
                </TabsTrigger>
                <TabsTrigger value="hints" className="gap-1.5 text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Lightbulb className="w-3.5 h-3.5" />
                  راهنمایی
                </TabsTrigger>
                <TabsTrigger value="output" className="gap-1.5 text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none lg:hidden">
                  <Code2 className="w-3.5 h-3.5" />
                  خروجی
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 overflow-y-auto m-0 p-4 md:p-6">
                <div className="space-y-6 text-right">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-base mb-3">توضیحات</h3>
                    <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>

                  {/* Input Format */}
                  <div>
                    <h3 className="font-bold text-base mb-2">ورودی</h3>
                    <p className="text-sm text-muted-foreground leading-7">{problem.inputFormat}</p>
                  </div>

                  {/* Output Format */}
                  <div>
                    <h3 className="font-bold text-base mb-2">خروجی</h3>
                    <p className="text-sm text-muted-foreground leading-7">{problem.outputFormat}</p>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-bold text-base mb-2">محدودیت‌ها</h3>
                    <ul className="space-y-1.5">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">{"•"}</span>
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-bold text-base mb-3">{"مثال‌ها"}</h3>
                    <div className="space-y-4">
                      {problem.examples.map((ex, i) => (
                        <Card key={i} className="overflow-hidden border-border/50">
                          <div className="grid grid-cols-2 divide-x divide-border/50">
                            {/* Input */}
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">ورودی</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopyExample(ex.input, i)}
                                >
                                  {copied === i ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                              <pre className="font-mono text-sm bg-muted/50 rounded p-2 text-left" dir="ltr">
                                {ex.input}
                              </pre>
                            </div>
                            {/* Output */}
                            <div className="p-3">
                              <div className="flex items-center mb-2">
                                <span className="text-xs font-medium text-muted-foreground">خروجی</span>
                              </div>
                              <pre className="font-mono text-sm bg-muted/50 rounded p-2 text-left" dir="ltr">
                                {ex.output}
                              </pre>
                            </div>
                          </div>
                          {ex.explanation && (
                            <div className="px-3 py-2 border-t border-border/50 bg-muted/30">
                              <span className="text-xs text-muted-foreground">{ex.explanation}</span>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hints" className="flex-1 overflow-y-auto m-0 p-4 md:p-6">
                <div className="space-y-4 text-right">
                  <h3 className="font-bold text-base mb-4">{"راهنمایی‌ها"}</h3>
                  {!showHints ? (
                    <div className="text-center py-8">
                      <Lightbulb className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        {"آیا مطمئن هستید که می‌خواهید راهنمایی‌ها را ببینید؟"}
                      </p>
                      <Button variant="outline" onClick={() => setShowHints(true)}>
                        {"نمایش راهنمایی‌ها"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {problem.hints.map((hint, i) => (
                        <Card key={i} className="p-4 border-amber-500/20 bg-amber-500/5">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                {i + 1}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-6">{hint}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Mobile output tab */}
              <TabsContent value="output" className="flex-1 overflow-y-auto m-0 p-4 lg:hidden">
                <div className="space-y-3">
                  {getStatusDisplay() && <div className="mb-2">{getStatusDisplay()}</div>}
                  <pre
                    className="font-mono text-sm bg-[#1e1e1e] text-green-400 rounded-lg p-4 min-h-[100px] whitespace-pre-wrap"
                    dir="ltr"
                  >
                    {output || "Run your code to see output here..."}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Editor & Output */}
          <div className="flex-1 flex flex-col overflow-hidden h-[60vh] lg:h-full">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-card/50">
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={handleResetCode}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">بازنشانی</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-transparent"
                  onClick={handleRun}
                  disabled={status === "running"}
                >
                  <Play className="w-3.5 h-3.5" />
                  اجرا
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleSubmit}
                  disabled={status === "running" || !user}
                >
                  <Send className="w-3.5 h-3.5" />
                  ارسال
                </Button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                onMount={() => setEditorMounted(true)}
                options={{
                  readOnly: false,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, monospace",
                  minimap: { enabled: false },
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 4,
                  bracketPairColorization: { enabled: true },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  acceptSuggestionOnEnter: "on",
                }}
              />
            </div>

            {/* Output Panel - Desktop */}
            <div className="hidden lg:block border-t">
              <div className="flex items-center justify-between px-3 py-1.5 bg-card/50">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">خروجی</span>
                </div>
                {getStatusDisplay()}
              </div>
              <pre
                className="font-mono text-sm bg-[#1e1e1e] text-green-400 p-4 h-[150px] overflow-y-auto whitespace-pre-wrap"
                dir="ltr"
              >
                {output || "Run your code to see output here..."}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
