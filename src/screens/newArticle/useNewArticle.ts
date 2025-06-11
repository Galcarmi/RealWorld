import { useCallback, useState, useMemo } from 'react';
import { Keyboard } from 'react-native';

import { navigationService } from '../../services/navigationService';
import { CreateArticleRequest } from '../../services/types';
import { articlesStore } from '../../store/articlesStore';

export const useNewArticle = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onTitleChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const onDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const onBodyChange = useCallback((text: string) => {
    setBody(text);
  }, []);

  const onPublishArticle = useCallback(async () => {
    if (!title.trim() || !description.trim() || !body.trim()) {
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const articleData: CreateArticleRequest = {
        title: title.trim(),
        description: description.trim(),
        body: body.trim(),
      };

      await articlesStore.createArticle(articleData);

      setTitle('');
      setDescription('');
      setBody('');

      navigationService.navigateToMainTabs();
    } catch (error) {
      console.error('Failed to create article:', error);
    } finally {
      setIsLoading(false);
    }
  }, [title, description, body]);

  const onGoBack = useCallback(() => {
    navigationService.navigateToMainTabs();
  }, []);

  const canPublish = useMemo(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedBody = body.trim();

    const isValid =
      trimmedTitle.length > 0 &&
      trimmedDescription.length > 0 &&
      trimmedBody.length > 0;

    return isValid;
  }, [title, description, body]);

  return {
    title,
    description,
    body,
    isLoading,
    canPublish,
    onTitleChange,
    onDescriptionChange,
    onBodyChange,
    onPublishArticle,
    onGoBack,
  };
};
