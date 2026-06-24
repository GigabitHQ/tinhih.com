import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const consentSchema = z.object({
  // HIPAA and Privacy
  hipaaConsent: z.boolean().refine(val => val === true, 'You must consent to HIPAA practices'),
  privacyPolicyConsent: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
  
  // Treatment consent
  treatmentConsent: z.boolean().refine(val => val === true, 'You must consent to treatment'),
  emergencyTreatmentConsent: z.boolean().default(true),
  
  // Communication preferences
  emailConsent: z.boolean().default(true),
  smsConsent: z.boolean().default(false),
  phoneConsent: z.boolean().default(true),
  mailConsent: z.boolean().default(true),
  
  // Financial consent
  financialConsent: z.boolean().refine(val => val === true, 'You must consent to financial policies'),
  slidingScaleConsent: z.boolean().default(true),
  
  // Research and quality improvement
  researchConsent: z.boolean().default(false),
  qualityImprovementConsent: z.boolean().default(true),
  
  // Additional agreements
  noShowPolicyConsent: z.boolean().refine(val => val === true, 'You must accept the no-show policy'),
  cancellationPolicyConsent: z.boolean().refine(val => val === true, 'You must accept the cancellation policy'),
  
  // Additional information
  additionalConsentInfo: z.string().optional(),
});

type ConsentData = z.infer<typeof consentSchema>;

interface ConsentStepProps {
  data: any;
  existingData?: any;
  onComplete: (data: ConsentData) => void;
  onBack: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export function ConsentStep({ data, existingData, onComplete, onBack, isEditing }: ConsentStepProps) {
  const form = useForm<ConsentData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      hipaaConsent: data.hipaaConsent || false,
      privacyPolicyConsent: data.privacyPolicyConsent || false,
      treatmentConsent: data.treatmentConsent || false,
      emergencyTreatmentConsent: data.emergencyTreatmentConsent ?? true,
      emailConsent: data.emailConsent ?? true,
      smsConsent: data.smsConsent ?? false,
      phoneConsent: data.phoneConsent ?? true,
      mailConsent: data.mailConsent ?? true,
      financialConsent: data.financialConsent || false,
      slidingScaleConsent: data.slidingScaleConsent ?? true,
      researchConsent: data.researchConsent ?? false,
      qualityImprovementConsent: data.qualityImprovementConsent ?? true,
      noShowPolicyConsent: data.noShowPolicyConsent || false,
      cancellationPolicyConsent: data.cancellationPolicyConsent || false,
      additionalConsentInfo: data.additionalConsentInfo || '',
    },
  });

  const onSubmit = (formData: ConsentData) => {
    console.log('Consent form submitted:', formData);
    onComplete(formData);
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Consent & Agreements</h2>
        <p className="text-muted-foreground">
          Please review and consent to the following policies and agreements. These are required to provide you with care.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* HIPAA and Privacy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              Privacy & HIPAA Consent
            </h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Notice of Privacy Practices:</strong> TiNHiH Foundation is committed to protecting your privacy. We follow all HIPAA regulations and maintain strict confidentiality of your health information.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="hipaaConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I have read and understand the Notice of Privacy Practices and consent to the use and disclosure of my health information as described 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacyPolicyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I accept the TiNHiH Foundation Privacy Policy and Terms of Service 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Treatment Consent */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
              Treatment Consent
            </h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Treatment Consent:</strong> By consenting to treatment, you acknowledge that you understand the nature of your condition and the proposed treatment plan.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="treatmentConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I consent to receive treatment from TiNHiH Foundation and understand that I have the right to refuse any treatment 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyTreatmentConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to emergency medical treatment if I am unable to provide consent at the time of treatment
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">Communication Preferences</h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Please indicate how you would like to receive communications from TiNHiH Foundation:
              </p>
            </div>
            
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="emailConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Email communications (appointment reminders, updates, etc.)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Text message communications (appointment reminders, urgent updates)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Phone calls (appointment scheduling, follow-up calls)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mailConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mail communications (billing statements, important documents)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Financial Consent */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              Financial Policies
            </h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Financial Policies:</strong> TiNHiH Foundation offers sliding scale fees and financial assistance. We are committed to making recovery accessible regardless of financial circumstances.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="financialConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I understand and agree to the financial policies of TiNHiH Foundation, including payment terms and sliding scale options 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slidingScaleConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I understand that sliding scale fees are available based on income and household size
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Research and Quality Improvement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">Research & Quality Improvement</h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Research & Quality Improvement:</strong> Your participation in research and quality improvement initiatives helps us provide better care to all patients. Participation is completely voluntary.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="researchConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to participate in research studies related to addiction recovery and mental health (optional)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qualityImprovementConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to participate in quality improvement initiatives to help improve our services
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              Important Policies
            </h3>
            
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>No-Show & Cancellation Policy:</strong> We understand that emergencies happen. Please provide at least 24 hours notice for cancellations to allow other patients to use your appointment time.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="noShowPolicyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I understand and agree to the no-show policy, which may result in a fee for missed appointments without proper notice 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cancellationPolicyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I understand and agree to the cancellation policy requiring 24 hours notice for appointment changes 
                      <span className="text-muted-foreground"> *</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">Additional Information</h3>
            
            <FormField
              control={form.control}
              name="additionalConsentInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments or Questions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="If you have any questions about these policies or need clarification, please let us know..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="fgrid sm:flex justify-center  sm:justify-between gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2 order-2 sm:order-1">
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button type="submit" className="flex items-center gap-2 order-1 sm:order-2">
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
