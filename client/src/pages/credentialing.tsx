import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { extractTextFromFile } from '@/lib/utils';
import { CredentialingRequest, EvaluationResult } from '@shared/schema';
import { 
  FileText, 
  Award, 
  IdCard, 
  Shield, 
  Trophy, 
  FileSignature, 
  DollarSign,
  Brain,
  Download,
  Printer,
  Mail,
  Plus,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserRound,
  Bell,
  User
} from 'lucide-react';

type DocumentType = keyof CredentialingRequest;

interface UploadState {
  file: File | null;
  content: string;
  isUploading: boolean;
}

const documentTypes: Array<{
  key: DocumentType;
  title: string;
  icon: React.ReactNode;
  description: string;
  accept: string;
}> = [
  {
    key: 'resume',
    title: 'Resume',
    icon: <FileText />,
    description: 'PDF, DOC, DOCX (Max 10MB)',
    accept: '.pdf,.doc,.docx'
  },
  {
    key: 'medical_license',
    title: 'Medical License',
    icon: <Award />,
    description: 'PDF, JPG, PNG (Max 10MB)',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    key: 'dea_id',
    title: 'DEA ID Card',
    icon: <IdCard />,
    description: 'PDF, JPG, PNG (Max 10MB)',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    key: 'malpractice_insurance',
    title: 'Malpractice Insurance',
    icon: <Shield />,
    description: 'PDF, DOC, DOCX (Max 10MB)',
    accept: '.pdf,.doc,.docx'
  },
  {
    key: 'board_certification',
    title: 'Board Certification',
    icon: <Trophy />,
    description: 'PDF, JPG, PNG (Max 10MB)',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    key: 'caqh_attestation',
    title: 'CAQH Attestation',
    icon: <FileSignature />,
    description: 'PDF, DOC, DOCX (Max 10MB)',
    accept: '.pdf,.doc,.docx'
  },
  {
    key: 'w9',
    title: 'W-9 Form',
    icon: <DollarSign />,
    description: 'PDF, DOC, DOCX (Max 10MB)',
    accept: '.pdf,.doc,.docx'
  }
];

export default function CredentialingPage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'evaluating' | 'results'>('upload');
  const [uploads, setUploads] = useState<Record<DocumentType, UploadState>>({
    resume: { file: null, content: '', isUploading: false },
    medical_license: { file: null, content: '', isUploading: false },
    dea_id: { file: null, content: '', isUploading: false },
    malpractice_insurance: { file: null, content: '', isUploading: false },
    board_certification: { file: null, content: '', isUploading: false },
    caqh_attestation: { file: null, content: '', isUploading: false },
    w9: { file: null, content: '', isUploading: false }
  });
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const { toast } = useToast();

  const evaluationMutation = useMutation({
    mutationFn: async (data: CredentialingRequest) => {
      const response = await apiRequest('POST', '/api/evaluate', data);
      return response.json();
    },
    onSuccess: (result: EvaluationResult) => {
      setEvaluationResult(result);
      setCurrentStep('results');
      toast({
        title: "Evaluation Complete",
        description: "Your credentialing documents have been evaluated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive",
      });
      setCurrentStep('upload');
    }
  });

  const handleFileSelect = async (docType: DocumentType, file: File) => {
    setUploads(prev => ({
      ...prev,
      [docType]: { ...prev[docType], isUploading: true }
    }));

    try {
      const content = await extractTextFromFile(file);
      setUploads(prev => ({
        ...prev,
        [docType]: { file, content, isUploading: false }
      }));
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      setUploads(prev => ({
        ...prev,
        [docType]: { file: null, content: '', isUploading: false }
      }));
      
      toast({
        title: "Upload Failed",
        description: "Failed to process the uploaded file.",
        variant: "destructive",
      });
    }
  };

  const handleEvaluate = async () => {
    const requestData: CredentialingRequest = {
      resume: uploads.resume.content,
      medical_license: uploads.medical_license.content,
      dea_id: uploads.dea_id.content,
      malpractice_insurance: uploads.malpractice_insurance.content,
      board_certification: uploads.board_certification.content,
      caqh_attestation: uploads.caqh_attestation.content,
      w9: uploads.w9.content
    };

    setCurrentStep('evaluating');
    evaluationMutation.mutate(requestData);
  };

  const handleNewEvaluation = () => {
    setCurrentStep('upload');
    setEvaluationResult(null);
    setUploads({
      resume: { file: null, content: '', isUploading: false },
      medical_license: { file: null, content: '', isUploading: false },
      dea_id: { file: null, content: '', isUploading: false },
      malpractice_insurance: { file: null, content: '', isUploading: false },
      board_certification: { file: null, content: '', isUploading: false },
      caqh_attestation: { file: null, content: '', isUploading: false },
      w9: { file: null, content: '', isUploading: false }
    });
  };

  const isAllUploaded = documentTypes.every(doc => uploads[doc.key].content !== '');
  const uploadProgress = (documentTypes.filter(doc => uploads[doc.key].content !== '').length / documentTypes.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <UserRound className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-xl font-semibold text-gray-900">MedCred Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Dr. Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Credentialing Evaluation</h1>
          <p className="text-gray-600">Upload and evaluate credentialing documents for compliance verification</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'upload' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'upload' ? 'text-blue-600' : 'text-green-600'
              }`}>
                Upload Documents
              </span>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'evaluating' ? 'bg-blue-600 text-white' : 
                currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'evaluating' ? 'text-blue-600' : 
                currentStep === 'results' ? 'text-green-600' : 'text-gray-500'
              }`}>
                AI Evaluation
              </span>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'results' ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Review Results
              </span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {currentStep === 'upload' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {documentTypes.map((docType) => (
                <FileUpload
                  key={docType.key}
                  onFileSelect={(file) => handleFileSelect(docType.key, file)}
                  accept={docType.accept}
                  isUploaded={uploads[docType.key].content !== ''}
                  isUploading={uploads[docType.key].isUploading}
                  icon={docType.icon}
                  title={docType.title}
                  description={docType.description}
                  required={true}
                />
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <span>All documents are required for credentialing evaluation</span>
                  </div>
                  <Button 
                    onClick={handleEvaluate}
                    disabled={!isAllUploaded}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Start AI Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading Section */}
        {currentStep === 'evaluating' && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Evaluation in Progress</h3>
                <p className="text-gray-600 mb-4">Analyzing your credentialing documents for compliance...</p>
                <Progress value={65} className="w-full mb-4" />
                <p className="text-sm text-gray-500">This typically takes 30-60 seconds</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {currentStep === 'results' && evaluationResult && (
          <div className="mb-8">
            <Card className="overflow-hidden">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Credentialing Evaluation Results</h2>
                    <p className="text-blue-100 text-sm">Evaluated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Overall Status */}
              <CardContent className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Doctor: {evaluationResult.doctor_name}
                    </h3>
                    <p className="text-gray-600">Overall Credentialing Status</p>
                  </div>
                  <div className="flex items-center">
                    <Badge 
                      variant={evaluationResult.result === 'Pass' ? 'default' : 'destructive'}
                      className={`px-4 py-2 ${
                        evaluationResult.result === 'Pass' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }`}
                    >
                      {evaluationResult.result === 'Pass' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {evaluationResult.result}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              {/* Issues Summary */}
              {evaluationResult.issues.length > 0 && (
                <CardContent className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    Issues Identified
                  </h4>
                  <div className="space-y-3">
                    {evaluationResult.issues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-900">{issue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}

              {/* Next Steps */}
              {evaluationResult.next_steps.length > 0 && (
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                    Required Next Steps
                  </h4>
                  <div className="space-y-4">
                    {evaluationResult.next_steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-900">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <Button variant="outline" onClick={handleNewEvaluation}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Evaluation
                </Button>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Send to Compliance
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Compliance Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              Credentialing Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Current resume with complete work history</li>
                  <li>• Valid medical license (state/NMC/MCI)</li>
                  <li>• Current DEA registration</li>
                  <li>• Malpractice insurance ($1M/$3M minimum)</li>
                  <li>• Board certification documents</li>
                  <li>• CAQH attestation (updated within 120 days)</li>
                  <li>• Completed W-9 tax form</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Compliance Standards</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All licenses must be current and valid</li>
                  <li>• No gaps in professional history</li>
                  <li>• Adequate malpractice coverage</li>
                  <li>• Specialty-appropriate board certification</li>
                  <li>• Complete and accurate documentation</li>
                  <li>• Consistent information across all documents</li>
                  <li>• Up-to-date CAQH profile</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">© 2024 Medical Credentialing Portal. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
