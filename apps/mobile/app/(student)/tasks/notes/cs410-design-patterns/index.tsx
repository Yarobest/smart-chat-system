import React, { useState } from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';
import { getReturnPath, clearReturnPath } from '@/src/stores/navigationStore';

export default function ReadNoteScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const navigation = useNavigation();

  // Mock data - replace with actual data from params
  const noteData = {
    courseCode: 'CS410',
    courseTitle: 'Design Patterns',
    title: 'Design Patterns — Chapter 4',
    chapter: 'Chapter 4 — Lecture Notes',
    uploadedBy: 'Dr. Mensah',
    uploadedDate: 'Jan 13',
    totalPages: 12,
    tags: ['LECTURE NOTE', 'CS410', 'CHAPTER 4'],
    pages: [
      {
        id: 1,
        section: '4.1 The Factory Pattern',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        keyConcept: {
          title: 'Key Concept: Factory pattern delegates object creation to subclasses, enabling loose coupling.',
          icon: '💡',
        },
      },
      {
        id: 2,
        section: '4.2 The Observer Pattern',
        content:
          'The Observer pattern is a behavioral design pattern that creates a subscription mechanism to allow multiple objects to listen for events...',
        keyConcept: {
          title:
            'Key Concept: Observer pattern establishes a one-to-many relationship between objects.',
          icon: '💡',
        },
      },
    ],
  };

  const handleBack = () => {
    // Check if we have a return path in the navigation store
    const returnPath = getReturnPath();
    
    if (returnPath) {
      // Navigate back to the specified return path (e.g., group chat)
      clearReturnPath();
      router.navigate(returnPath as any);
    } else if (navigation.canGoBack()) {
      // Try to go back using navigation stack
      router.back();
    } else {
      // Fallback to home if nothing else works
      router.navigate("/(student)/home" as any);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < noteData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const fileName = `${noteData.courseCode}_DesignPatterns_Chapter4.pdf`;
      
      // Create a sample PDF blob locally (avoids CORS issues)
      // This is a minimal valid PDF with content
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 24 Tf
50 750 Td
(CS410 - Design Patterns) Tj
0 -30 Td
/F1 12 Tf
(Chapter 4: Factory, Observer & Strategy Patterns) Tj
0 -50 Td
/F1 11 Tf
(Uploaded by Dr. Mensah) Tj
0 -20 Td
(Date: January 13, 2026) Tj
0 -40 Td
(Page 1 of 12) Tj
0 -60 Td
/F1 10 Tf
(4.1 The Factory Pattern) Tj
0 -20 Td
(The Factory Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but lets subclasses decide which class to instantiate.) Tj
0 -20 Td
(Key Concept: Factory pattern delegates object creation to subclasses, enabling loose coupling.) Tj
0 -40 Td
(Benefits:) Tj
0 -15 Td
(• Promotes loose coupling by reducing dependencies) Tj
0 -15 Td
(• Makes code more flexible and maintainable) Tj
0 -15 Td
(• Supports the Open/Closed Principle) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
0000000764 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
850
%%EOF`;

      // Simulate progressive download with chunks
      const totalSteps = 20;
      for (let i = 0; i < totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const progress = Math.round((i / totalSteps) * 100);
        setDownloadProgress(progress);
      }
      setDownloadProgress(100);

      // Create blob from PDF content
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const fileSize = (blob.size / 1024).toFixed(2); // Convert to KB

      // Download the file
      if (Platform.OS === 'web') {
        // Web download - create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        // Mobile fallback
        console.log(`Downloaded file: ${fileName}, Size: ${fileSize} KB`);
      }

      // Wait before showing success
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success alert
      Alert.alert(
        '✓ Download Complete',
        `${fileName}\n\nFile saved to Downloads folder\n\nFile size: ${fileSize} KB`,
        [{ 
          text: 'OK',
          onPress: () => {
            setIsDownloading(false);
            setDownloadProgress(0);
          }
        }]
      );
    } catch (error) {
      console.error('Download error:', error);

      Alert.alert(
        '✗ Download Failed',
        `There was an error creating the PDF:\n${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ 
          text: 'Retry',
          onPress: () => {
            setIsDownloading(false);
            setDownloadProgress(0);
          }
        },
        {
          text: 'Cancel',
          onPress: () => {
            setIsDownloading(false);
            setDownloadProgress(0);
          }
        }]
      );
    }
  };

  const currentPageData = noteData.pages[currentPage - 1];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#051839" />

      {/* Header */}
      <View className="bg-[#051839] px-4 py-4 flex-row items-center gap-3">
        <Pressable onPress={handleBack} className="p-2">
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-base font-bold text-white">
            {noteData.courseCode} - {noteData.courseTitle}
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">{noteData.chapter}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white">
        {/* Note Info Card */}
        <View className="px-4 py-4">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <View className="flex-row gap-4">
              {/* Icon */}
              <View className="w-12 h-12 rounded-lg bg-blue-100 items-center justify-center">
                <Ionicons name="document-text" size={24} color="#2563EB" />
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900 mb-1">
                  {noteData.title}
                </Text>
                <Text className="text-xs text-slate-600 mb-2">
                  Uploaded by {noteData.uploadedBy} · {noteData.uploadedDate} · 12 pages
                </Text>

                {/* Tags */}
                <View className="flex-row gap-2 flex-wrap">
                  {noteData.tags.map((tag, index) => (
                    <View
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        index === 0
                          ? 'bg-purple-100 text-purple-700'
                          : index === 1
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          index === 0
                            ? 'text-purple-700'
                            : index === 1
                            ? 'text-blue-700'
                            : 'text-orange-700'
                        }`}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Page Navigation */}
          <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <Text className="text-sm font-semibold text-slate-600">
              Page {currentPage} of {noteData.totalPages}
            </Text>
            <View className="flex-row gap-2">
              <Pressable className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center border border-blue-200">
                <Ionicons name="search" size={18} color="#2563EB" />
              </Pressable>
              <Pressable className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center border border-blue-200">
                <Ionicons name="search-outline" size={18} color="#2563EB" />
              </Pressable>
            </View>
          </View>

          {/* Content Section */}
          {currentPageData && (
            <View className="mb-6">
              <Text
                className="text-xl font-bold text-slate-900 mb-3"
                style={{ fontSize: Math.max(16, fontSize) }}
              >
                {currentPageData.section}
              </Text>

              {/* Placeholder Lines (representing content) */}
              <View className="mb-4">
                <View className="h-2 bg-slate-200 rounded-full mb-2 w-full" />
                <View className="h-2 bg-slate-200 rounded-full mb-2 w-5/6" />
                <View className="h-2 bg-slate-200 rounded-full mb-2 w-full" />
                <View className="h-2 bg-slate-200 rounded-full w-4/6" />
              </View>

              <Text className="text-base text-slate-700 leading-7 mb-6">
                {currentPageData.content}
              </Text>

              {/* Key Concept Box */}
              {currentPageData.keyConcept && (
                <View className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 flex-row gap-3">
                  <View className="pt-1">
                    <Text className="text-2xl">{currentPageData.keyConcept.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-blue-600 mb-1">
                      Key Concept: Factory pattern delegates
                    </Text>
                    <Text className="text-sm text-slate-700">
                      {currentPageData.keyConcept.title}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Pagination Controls */}
          <View className="flex-row items-center justify-between mb-6 py-4">
            <Pressable
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex-row items-center gap-1 ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
              <Text className={`text-sm font-semibold ${currentPage === 1 ? 'text-slate-400' : 'text-slate-700'}`}>
                — Prev
              </Text>
            </Pressable>

            <Text className="text-sm text-slate-600">
              {currentPage} / {noteData.totalPages}
            </Text>

            <Pressable
              onPress={handleNextPage}
              disabled={currentPage === noteData.totalPages}
              className={`flex-row items-center gap-1 ${currentPage === noteData.totalPages ? 'opacity-50' : ''}`}
            >
              <Text
                className={`text-sm font-semibold ${
                  currentPage === noteData.totalPages ? 'text-slate-400' : 'text-blue-600'
                }`}
              >
                Next →
              </Text>
            </Pressable>
          </View>

          {/* Download PDF Button */}
          <Pressable 
            onPress={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 overflow-hidden"
          >
            {isDownloading ? (
              <View className="w-full">
                {/* Progress Bar */}
                <View className="w-full h-10 bg-blue-100 rounded-lg overflow-hidden items-center justify-center mb-2">
                  <View 
                    className="h-full bg-blue-500 absolute left-0"
                    style={{ width: `${downloadProgress}%` }}
                  />
                  <Text className="text-xs font-bold text-blue-900 relative z-10">
                    {downloadProgress}%
                  </Text>
                </View>
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator size="small" color="#2563EB" />
                  <Text className="text-sm font-bold text-blue-600">Downloading...</Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="document-outline" size={20} color="#2563EB" />
                <Text className="text-sm font-bold text-blue-600">Download PDF</Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
