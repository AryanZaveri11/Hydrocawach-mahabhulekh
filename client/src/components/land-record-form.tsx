import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { landRecordSearchSchema, type LandRecordSearchForm, type State, type District, type Taluka, type Village } from "@shared/schema";
import { RECORD_TYPES, LANGUAGES } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface LandRecordFormProps {
  selectedStateFromMap?: number;
}

export default function LandRecordForm({ selectedStateFromMap }: LandRecordFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchMode, setSearchMode] = useState<"manual" | "uid">("manual");
  const [captcha, setCaptcha] = useState("");

  const form = useForm<LandRecordSearchForm>({
    resolver: zodResolver(landRecordSearchSchema),
    defaultValues: {
      recordType: "7-12",
      searchMode: "manual",
      language: "hindi",
      mobileNumber: "",
      captcha: ""
    }
  });

  const watchedStateId = form.watch("stateId");
  const watchedDistrictId = form.watch("districtId");
  const watchedTalukaId = form.watch("talukaId");

  // Set state from map selection
  useEffect(() => {
    if (selectedStateFromMap) {
      form.setValue("stateId", selectedStateFromMap);
    }
  }, [selectedStateFromMap, form]);

  // Fetch states
  const { data: states } = useQuery<State[]>({
    queryKey: ["/api/states"],
  });

  // Fetch districts
  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/states", watchedStateId, "districts"],
    enabled: !!watchedStateId,
  });

  // Fetch talukas
  const { data: talukas } = useQuery<Taluka[]>({
    queryKey: ["/api/districts", watchedDistrictId, "talukas"],
    enabled: !!watchedDistrictId,
  });

  // Fetch villages
  const { data: villages } = useQuery<Village[]>({
    queryKey: ["/api/talukas", watchedTalukaId, "villages"],
    enabled: !!watchedTalukaId,
  });

  // Fetch captcha
  const { data: captchaData } = useQuery<{ captcha: string }>({
    queryKey: ["/api/captcha"],
    refetchInterval: false,
  });

  useEffect(() => {
    if (captchaData?.captcha) {
      setCaptcha(captchaData.captcha);
    }
  }, [captchaData]);

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (data: LandRecordSearchForm) => {
      const response = await apiRequest("POST", "/api/search-land-records", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Search Completed",
        description: `Found ${data.total} records`,
      });
      setLocation(`/search-results?requestId=${data.searchRequestId}`);
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LandRecordSearchForm) => {
    searchMutation.mutate(data);
  };

  const refreshCaptcha = () => {
    // Force refetch captcha
    setCaptcha(Math.random().toString(36).substring(2, 7).toUpperCase());
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="mb-6">
          <CardTitle className="text-lg font-semibold text-primary mb-4">
            अधिकार अभिलेखाचा प्रकार निवडा (Select Record of Right)
          </CardTitle>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(RECORD_TYPES).map(([key, labels]) => (
              <Button
                key={key}
                type="button"
                variant={form.watch("recordType") === key ? "default" : "outline"}
                className="p-3 h-auto flex flex-col items-center"
                onClick={() => form.setValue("recordType", key as any)}
              >
                <div className="text-2xl font-bold">{labels.hi}</div>
                <div className="text-sm">({labels.en})</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Property UID Section */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-primary mb-3">
            तुम्हाला तुमचा 11 अंकी प्रॉपर्टी यूआयडी क्रमांक माहीत आहे का?<br />
            <span className="text-sm font-normal">(Do You Know Your 11 Digit Property UID Number?)</span>
          </h4>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={searchMode === "uid" ? "default" : "outline"}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                setSearchMode("uid");
                form.setValue("searchMode", "uid");
              }}
            >
              होय (Yes)
            </Button>
            <Button
              type="button"
              variant={searchMode === "manual" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setSearchMode("manual");
                form.setValue("searchMode", "manual");
              }}
            >
              नाही (No)
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              ७/१२ माहिती (7/12 Details)
            </h3>

            {searchMode === "uid" ? (
              <FormField
                control={form.control}
                name="propertyUid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property UID <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="11 अंकी प्रॉपर्टी यूआयडी दर्ज करें"
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                {/* State Selection */}
                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>राज्य (State) <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          form.setValue("districtId", undefined);
                          form.setValue("talukaId", undefined);
                          form.setValue("villageId", undefined);
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--निवडा (Select)--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states?.map((state) => (
                            <SelectItem key={state.id} value={state.id.toString()}>
                              {state.nameHi} ({state.nameEn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* District Selection */}
                <FormField
                  control={form.control}
                  name="districtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>जिल्हा (District) <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          form.setValue("talukaId", undefined);
                          form.setValue("villageId", undefined);
                        }}
                        value={field.value?.toString()}
                        disabled={!watchedStateId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--निवडा (Select)--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts?.map((district) => (
                            <SelectItem key={district.id} value={district.id.toString()}>
                              {district.nameHi} ({district.nameEn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Taluka Selection */}
                <FormField
                  control={form.control}
                  name="talukaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>तालुका (Taluka) <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          form.setValue("villageId", undefined);
                        }}
                        value={field.value?.toString()}
                        disabled={!watchedDistrictId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--निवडा (Select)--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {talukas?.map((taluka) => (
                            <SelectItem key={taluka.id} value={taluka.id.toString()}>
                              {taluka.nameHi} ({taluka.nameEn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Village Selection */}
                <FormField
                  control={form.control}
                  name="villageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>गाव (Village) <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={!watchedTalukaId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--निवडा (Select)--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villages?.map((village) => (
                            <SelectItem key={village.id} value={village.id.toString()}>
                              {village.nameHi} ({village.nameEn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Survey Numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="surveyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          सर्वे नंबर (Survey Number) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="सर्वे नंबर प्रविष्ट करा" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subdivisionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>उप-विभाग नंबर (Sub-division)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="उप-विभाग नंबर" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>मालकाचे नाव (Owner Name)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="मालकाचे नाव प्रविष्ट करा" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>मोबाईल (Mobile) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      placeholder="मोबाईल नंबर प्रविष्ट करा"
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Selection */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>भाषा निवडा (Select Language) <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(LANGUAGES).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Captcha */}
            <FormField
              control={form.control}
              name="captcha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>सांकेतिक क्रमांक (Captcha) <span className="text-red-500">*</span></FormLabel>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md font-mono text-lg tracking-wider">
                      {captcha}
                    </div>
                    <FormControl>
                      <Input 
                        {...field}
                        className="flex-1"
                        placeholder="कॅप्चा प्रविष्ट करा"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={refreshCaptcha}
                    >
                      🔄
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 font-semibold"
              disabled={searchMutation.isPending}
            >
              {searchMutation.isPending ? "शोधत आहे..." : "अहवाल पाहा (View Report)"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}