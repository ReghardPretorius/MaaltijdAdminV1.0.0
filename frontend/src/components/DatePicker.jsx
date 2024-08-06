// DatePicker.js
import React, { useState, useEffect } from 'react';
import '../styles/DatePicker.css';

const DatePicker = ({ initialDate, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const initialMonth = initialDate ? initialDate.getMonth() : today.getMonth();
  const initialYear = initialDate ? initialDate.getFullYear() : today.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    if (onChange) {
      onChange(date);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const days = generateCalendar();
    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>&lt;</button>
          <span>{months[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-name">
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <div
              key={index}
              className={`calendar-day ${date ? '' : 'empty'} ${date && selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
              onClick={() => date && handleDateClick(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="date-picker">
      <input
        type="text"
        value={selectedDate ? selectedDate.toDateString() : ''}
        readOnly
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      />
      {isCalendarOpen && renderCalendar()}
    </div>
  );
};

export default DatePicker;
