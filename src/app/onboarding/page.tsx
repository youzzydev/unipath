'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { saveProfile } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic information about you' },
  { id: 2, title: 'Location', description: 'Where are you from?' },
  { id: 3, title: 'Education', description: 'Your academic background' },
  { id: 4, title: 'Preferences', description: 'What are you looking for?' },
  { id: 5, title: 'Documents', description: 'Ready to apply?' },
];

const DEGREE_TYPES = [
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
];

const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'other', label: 'Other' },
];

const SUBJECTS = [
  'Business & Management',
  'Computer Science',
  'Engineering',
  'Medicine & Healthcare',
  'Law',
  'Arts & Design',
  'Sciences',
  'Humanities',
  'Social Sciences',
  'Economics & Finance',
  'Architecture',
  'Other',
];

const UK_LOCATIONS = [
  'London',
  'Manchester',
  'Birmingham',
  'Edinburgh',
  'Glasgow',
  'Bristol',
  'Leeds',
  'Liverpool',
  'Oxford',
  'Cambridge',
  'Sheffield',
  'Newcastle',
  'Nottingham',
  'Southampton',
  'Cardiff',
  'Belfast',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, profileCompleted } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    current_country: '',
    education_level: '',
    gpa: '',
    preferred_subject: '',
    preferred_degree: '',
    budget_min: 10000,
    budget_max: 50000,
    preferred_locations: [] as string[],
    has_passport: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    } else if (!authLoading && user && profileCompleted) {
      router.push('/dashboard');
    }
  }, [authLoading, user, profileCompleted, router]);

  async function handleNext() {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        if (user) {
          await saveProfile(user.id, formData);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        setSaving(false);
      }
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function updateField(field: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleLocation(location: string) {
    setFormData((prev) => ({
      ...prev,
      preferred_locations: prev.preferred_locations.includes(location)
        ? prev.preferred_locations.filter((l) => l !== location)
        : [...prev.preferred_locations, location],
    }));
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 text-center">
            Tell us about yourself so we can find the best universities for you
          </p>
        </div>

        <Progress value={(step / 5) * 100} className="mb-8" />

        <div className="mb-6 flex justify-between">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center ${s.id === step ? 'text-blue-600' : s.id < step ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s.id === step
                    ? 'bg-blue-600 text-white'
                    : s.id < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {s.id < step ? <Check className="w-4 h-4" /> : s.id}
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step - 1].title}</CardTitle>
            <CardDescription>{STEPS[step - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+966..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => updateField('date_of_birth', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => updateField('nationality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="qatar">Qatar</SelectItem>
                      <SelectItem value="kuwait">Kuwait</SelectItem>
                      <SelectItem value="bahrain">Bahrain</SelectItem>
                      <SelectItem value="oman">Oman</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_country">Current Country</Label>
                  <Select
                    value={formData.current_country}
                    onValueChange={(value) => updateField('current_country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Where do you currently live?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="qatar">Qatar</SelectItem>
                      <SelectItem value="kuwait">Kuwait</SelectItem>
                      <SelectItem value="bahrain">Bahrain</SelectItem>
                      <SelectItem value="oman">Oman</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education_level">Current Education Level</Label>
                  <Select
                    value={formData.education_level}
                    onValueChange={(value) => updateField('education_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA / Grade Average</Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) => updateField('gpa', e.target.value)}
                    placeholder="e.g., 3.5/4.0 or 90%"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Subject Area</Label>
                  <Select
                    value={formData.preferred_subject}
                    onValueChange={(value) => updateField('preferred_subject', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What do you want to study?" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Degree Type</Label>
                  <Select
                    value={formData.preferred_degree}
                    onValueChange={(value) => updateField('preferred_degree', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What degree are you looking for?" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEGREE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Range (per year in GBP)</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) => updateField('budget_min', parseInt(e.target.value))}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) => updateField('budget_max', parseInt(e.target.value))}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Locations</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {UK_LOCATIONS.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={location}
                          checked={formData.preferred_locations.includes(location)}
                          onCheckedChange={() => toggleLocation(location)}
                        />
                        <label
                          htmlFor={location}
                          className="text-sm cursor-pointer"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_passport"
                    checked={formData.has_passport}
                    onCheckedChange={(checked) => updateField('has_passport', checked)}
                  />
                  <label htmlFor="has_passport" className="text-sm cursor-pointer">
                    I have a valid passport
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Having a passport ready will speed up your application process.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || saving}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : step === 5 ? (
                  <>
                    Complete
                    <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
