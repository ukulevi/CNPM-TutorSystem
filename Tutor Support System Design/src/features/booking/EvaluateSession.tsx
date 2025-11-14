import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Session } from '../../types';

type EvaluateSessionProps = {
  session: Session;
  onNavigate: (page: string) => void;
};

export function EvaluateSession({ session, onNavigate }: EvaluateSessionProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    console.log('Submitting evaluation:', { sessionId: session.id, rating, feedback });
    // In a real app, this would save to database
    onNavigate('student-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#0099CC] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#4DB8FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#003366] mb-2">Đánh giá buổi hẹn</h1>
            <p className="text-gray-600">với {session.tutorName}</p>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Môn học</p>
                <p className="text-gray-700">{session.subject}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày & Giờ</p>
                <p className="text-gray-700">
                  {session.date} • {session.time}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 text-center">
              Bạn đánh giá buổi hẹn này như thế nào?
            </label>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-3 text-gray-600">
                {rating === 1 && 'Rất không hài lòng'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Rất hài lòng'}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-gray-700 mb-3">
              Chia sẻ cảm nhận của bạn về buổi hẹn này...
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Viết nhận xét của bạn tại đây (không bắt buộc)"
              className="min-h-[120px] resize-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              {feedback.length} / 500 ký tự
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('student-dashboard')}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-[#003366] hover:bg-[#004488] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi đánh giá
            </Button>
          </div>

          {rating === 0 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Vui lòng chọn số sao để gửi đánh giá
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
