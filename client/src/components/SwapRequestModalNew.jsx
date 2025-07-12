import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useValidatedForm } from '../hooks/useForm';
import { swapRequestSchema } from '../utils/validation';
import { Button } from './ui/Button';
import { Select, Textarea } from './ui/Input';
import { Alert } from './ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

export function SwapRequestModal({ fromUser, toUser, onClose, onSubmit }) {
  const [submitError, setSubmitError] = useState('');

  const form = useValidatedForm(swapRequestSchema, {
    offeredSkill: '',
    requestedSkill: '',
    message: `Hi ${toUser.name}! I'd love to learn from you and share my knowledge in return. Let's explore a skill exchange!`
  });

  const handleSubmit = async (data) => {
    try {
      setSubmitError('');
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error.message || 'Failed to send request. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={X}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>

          {/* Content */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
            {submitError && (
              <Alert type="error" title="Error" className="mb-6">
                {submitError}
              </Alert>
            )}

            {/* User Info */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={toUser.profilePhoto}
                  alt={toUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{toUser.name}</h3>
                  <p className="text-gray-600">{toUser.location}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium text-gray-700">{toUser.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* What you offer */}
              <Select
                label="Skill I can offer"
                {...form.register('offeredSkill')}
                error={form.formState.errors.offeredSkill?.message}
              >
                <option value="">Select a skill you can offer</option>
                {fromUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </Select>

              {/* What you want */}
              <Select
                label="Skill I want to learn"
                {...form.register('requestedSkill')}
                error={form.formState.errors.requestedSkill?.message}
              >
                <option value="">Select a skill you want to learn</option>
                {toUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </Select>
            </div>

            {/* Exchange Preview */}
            {form.watch('offeredSkill') && form.watch('requestedSkill') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 rounded-lg p-4 mb-6"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skill Exchange Preview</h4>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {form.watch('offeredSkill')}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">You offer</p>
                  </div>
                  <div className="text-2xl text-gray-400">⇄</div>
                  <div className="text-center">
                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                      {form.watch('requestedSkill')}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">You learn</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Message */}
            <Textarea
              label="Personal Message"
              rows={4}
              {...form.register('message')}
              error={form.formState.errors.message?.message}
              placeholder="Write a personal message to introduce yourself and explain why you'd like to exchange skills..."
            />

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={Send}
                loading={form.formState.isSubmitting}
                disabled={!form.formState.isValid}
              >
                Send Request
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
