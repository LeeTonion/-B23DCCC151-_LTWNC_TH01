

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

interface CustomDateTimePickerProps {
  value: string; 
  onChange: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
}

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
  onBlur,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseDateValue = (valStr: string) => {
    const d = valStr ? new Date(valStr) : new Date();
    if (isNaN(d.getTime())) return new Date();
    return d;
  };

  const currentDateObj = parseDateValue(value);

  const [viewYear, setViewYear] = useState(currentDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDateObj.getMonth()); 
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateObj);
  const [hour, setHour] = useState<number>(currentDateObj.getHours());
  const [minute, setMinute] = useState<number>(currentDateObj.getMinutes());

  useEffect(() => {
    if (value) {
      const d = parseDateValue(value);
      setSelectedDate(d);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setHour(d.getHours());
      setMinute(d.getMinutes());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onBlur?.();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const emitChange = (date: Date, h: number, m: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(h);
    const min = pad(m);
    const result = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    onChange(result);
  };

  const handleSelectDay = (day: number, monthOffset: number = 0) => {
    const newDate = new Date(viewYear, viewMonth + monthOffset, day, hour, minute);
    setSelectedDate(newDate);
    emitChange(newDate, hour, minute);
  };

  const handleHourChange = (newHour: number) => {
    const h = Math.max(0, Math.min(23, newHour));
    setHour(h);
    emitChange(selectedDate, h, minute);
  };

  const handleMinuteChange = (newMin: number) => {
    const m = Math.max(0, Math.min(59, newMin));
    setMinute(m);
    emitChange(selectedDate, hour, m);
  };

  const applyTimePreset = (h: number, m: number) => {
    setHour(h);
    setMinute(m);
    emitChange(selectedDate, h, m);
  };

  const setQuickDays = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    target.setHours(23, 59, 0, 0);
    setSelectedDate(target);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setHour(23);
    setMinute(59);
    emitChange(target, 23, 59);
  };

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const days = [];

    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        monthOffset: -1,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        monthOffset: 0,
        isCurrentMonth: true,
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        monthOffset: 1,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const today = new Date();

  const formatDisplayValue = () => {
    if (!value) return 'Nhấn để chọn ngày giờ';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const date = d.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return `${time} • ${date}`;
    } catch {
      return value;
    }
  };

  return (
    <div className="custom-datetime-container" ref={containerRef}>
      
      <button
        type="button"
        className={`datetime-trigger-btn ${isOpen ? 'active' : ''} ${hasError ? 'input-error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-left">
          <Calendar size={18} className="trigger-icon" />
          <span className="trigger-value-text">{formatDisplayValue()}</span>
        </div>
        <div className="trigger-badge">
          <Clock size={14} />
          <span>{hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}</span>
        </div>
      </button>

      {isOpen && (
        <div className="datetime-popover">
          
          <div className="popover-presets-row">
            <button
              type="button"
              className="popover-preset-chip"
              onClick={() => setQuickDays(0)}
            >
              Hôm nay (23:59)
            </button>
            <button
              type="button"
              className="popover-preset-chip"
              onClick={() => setQuickDays(1)}
            >
              Ngày mai (23:59)
            </button>
            <button
              type="button"
              className="popover-preset-chip"
              onClick={() => setQuickDays(3)}
            >
              +3 ngày
            </button>
            <button
              type="button"
              className="popover-preset-chip"
              onClick={() => setQuickDays(7)}
            >
              +1 tuần
            </button>
          </div>

          <div className="calendar-header">
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handlePrevMonth}
              title="Tháng trước"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="cal-month-title">
              {MONTH_NAMES[viewMonth]}, {viewYear}
            </span>
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handleNextMonth}
              title="Tháng sau"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-grid-weekdays">
            {DAYS_OF_WEEK.map((w) => (
              <span key={w} className="cal-weekday-label">
                {w}
              </span>
            ))}
          </div>

          <div className="calendar-grid-days">
            {calendarDays.map((item, idx) => {
              const itemDate = new Date(viewYear, viewMonth + item.monthOffset, item.day);
              const isSelected =
                itemDate.getFullYear() === selectedDate.getFullYear() &&
                itemDate.getMonth() === selectedDate.getMonth() &&
                itemDate.getDate() === selectedDate.getDate();

              const isToday =
                itemDate.getFullYear() === today.getFullYear() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getDate() === today.getDate();

              return (
                <button
                  key={`${item.monthOffset}-${item.day}-${idx}`}
                  type="button"
                  className={`cal-day-cell ${!item.isCurrentMonth ? 'dimmed' : ''} ${
                    isSelected ? 'selected' : ''
                  } ${isToday ? 'today' : ''}`}
                  onClick={() => handleSelectDay(item.day, item.monthOffset)}
                >
                  <span>{item.day}</span>
                  {isToday && !isSelected && <span className="today-dot" />}
                </button>
              );
            })}
          </div>

          <div className="time-picker-section">
            <div className="time-picker-header">
              <Clock size={15} />
              <span>Thời gian nộp bài:</span>
            </div>

            <div className="time-controls-row">
              <div className="time-input-box">
                <span className="time-label">Giờ</span>
                <select
                  className="time-select"
                  value={hour}
                  onChange={(e) => handleHourChange(Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')} giờ
                    </option>
                  ))}
                </select>
              </div>

              <span className="time-separator">:</span>

              <div className="time-input-box">
                <span className="time-label">Phút</span>
                <select
                  className="time-select"
                  value={minute}
                  onChange={(e) => handleMinuteChange(Number(e.target.value))}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')} phút
                    </option>
                  ))}
                </select>
              </div>

              <div className="time-quick-pills">
                <button
                  type="button"
                  className={`time-pill ${hour === 23 && minute === 59 ? 'active' : ''}`}
                  onClick={() => applyTimePreset(23, 59)}
                >
                  23:59
                </button>
                <button
                  type="button"
                  className={`time-pill ${hour === 17 && minute === 0 ? 'active' : ''}`}
                  onClick={() => applyTimePreset(17, 0)}
                >
                  17:00
                </button>
                <button
                  type="button"
                  className={`time-pill ${hour === 12 && minute === 0 ? 'active' : ''}`}
                  onClick={() => applyTimePreset(12, 0)}
                >
                  12:00
                </button>
              </div>
            </div>
          </div>

          <div className="popover-footer">
            <span className="selected-preview-text">
              Đã chọn: <strong>{formatDisplayValue()}</strong>
            </span>
            <button
              type="button"
              className="btn-done-picker"
              onClick={() => {
                setIsOpen(false);
                onBlur?.();
              }}
            >
              <Check size={16} />
              <span>Xác nhận</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
