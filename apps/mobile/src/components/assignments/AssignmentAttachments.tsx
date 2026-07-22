import { useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { File, Paths } from 'expo-file-system';
import { getContentUriAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { API_URL } from '@/src/services/api';
import { authStore } from '@/src/stores/authStore';
import { AssignmentFile } from '@/src/types/assignment.types';

type Props = { files: AssignmentFile[] };

function fileUrl(uri: string) {
  return uri.startsWith('http://') || uri.startsWith('https://') ? uri : `${API_URL}${uri}`;
}

function isImage(file: AssignmentFile) {
  return file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(file.name);
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'assignment-file';
}

export function AssignmentAttachments({ files }: Props) {
  const [image, setImage] = useState<AssignmentFile | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const headers = authStore.session?.token
    ? { Authorization: `Bearer ${authStore.session.token}` }
    : undefined;

  const preview = async (file: AssignmentFile) => {
    if (isImage(file)) {
      setImage(file);
      return;
    }
    setOpening(file.uri);
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(fileUrl(file.uri), { headers });
        if (!response.ok) throw new Error('Could not download this attachment');
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        await WebBrowser.openBrowserAsync(objectUrl);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
        return;
      }

      const destination = new File(Paths.cache, safeFileName(file.name));
      const downloaded = await File.downloadFileAsync(fileUrl(file.uri), destination, {
        headers,
        idempotent: true,
      });
      if (Platform.OS === 'android') {
        const contentUri = await getContentUriAsync(downloaded.uri);
        try {
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            type: file.type ?? 'application/octet-stream',
            flags: 1,
          });
          return;
        } catch {
          // Some Android devices have no viewer registered for the file type.
        }
      }

      if (!(await Sharing.isAvailableAsync())) throw new Error('No application is available to open this file.');
      await Sharing.shareAsync(downloaded.uri, {
        mimeType: file.type ?? 'application/octet-stream',
        dialogTitle: `Choose an app for ${file.name}`,
      });
    } finally {
      setOpening(null);
    }
  };

  if (files.length === 0) return null;

  return (
    <View className="mt-4 gap-2">
      <Text className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Attached files</Text>
      {files.map((file) => (
        <Pressable
          key={file.id ?? file.uri}
          disabled={opening === file.uri}
          onPress={() => void preview(file).catch((error) =>
            Alert.alert('Could not open file', error instanceof Error ? error.message : 'Could not download this file.'),
          )}
          className="flex-row items-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-3"
        >
          <Text className="mr-2 text-lg">📎</Text>
          <View className="flex-1">
            <Text numberOfLines={1} className="text-sm font-bold text-blue-800">{file.name}</Text>
            <Text className="mt-0.5 text-xs text-blue-600">
              {opening === file.uri ? 'Downloading...' : isImage(file) ? 'Tap to preview' : 'Tap to download and open'}
            </Text>
          </View>
          <Text className="text-lg text-blue-400">›</Text>
        </Pressable>
      ))}

      <Modal visible={Boolean(image)} transparent animationType="fade" onRequestClose={() => setImage(null)}>
        <View className="flex-1 bg-black/90 px-4 pb-8 pt-14">
          <View className="mb-3 flex-row items-center justify-between">
            <Text numberOfLines={1} className="mr-4 flex-1 font-bold text-white">{image?.name}</Text>
            <Pressable onPress={() => setImage(null)} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="font-bold text-white">Close</Text>
            </Pressable>
          </View>
          {image ? (
            <Image
              source={{ uri: fileUrl(image.uri), headers }}
              resizeMode="contain"
              className="flex-1 rounded-xl"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
