"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { CalendarIcon, PlusIcon, TrashIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { usePlannerStore, CalendarEvent } from '@/lib/store/planner-store';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function PlannerPage() {
  const {
    events,
    selectedDate,
    selectedPlatform,
    platforms,
    eventStatuses,
    addEventToDefault,
    updateEvent,
    removeEvent,
    setSelectedDate,
    setSelectedPlatform,
    getEventsByDate,
    getEventsByPlatform,
  } = usePlannerStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: selectedDate,
    time: '09:00',
    platform: 'instagram',
    status: 'draft',
  });

  const currentDate = new Date(selectedDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1, 1);
    setSelectedDate(prev.toISOString().split('T')[0]);
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    setSelectedDate(next.toISOString().split('T')[0]);
  };

  const handleAddEvent = () => {
    addEventToDefault(form);
    setForm({ title: '', description: '', date: selectedDate, time: '09:00', platform: 'instagram', status: 'draft' });
    setShowAddModal(false);
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      updateEvent(editingEvent.id, form);
      setEditingEvent(null);
      setForm({ title: '', description: '', date: selectedDate, time: '09:00', platform: 'instagram', status: 'draft' });
    }
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      platform: event.platform,
      status: event.status,
    });
  };

  const filteredEvents = getEventsByPlatform(selectedPlatform);
  const dayEvents = getEventsByDate(selectedDate);

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Planner</h1>
          <p className="text-gray-600">Schedule and manage your content calendar</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {MONTHS[currentMonth]} {currentYear}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNextMonth}>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS.map((day) => (
                      <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const hasEvents = events.some((e) => e.date === dateStr);
                      const isSelected = dateStr === selectedDate;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`relative rounded-lg p-2 text-center text-sm transition-colors hover:bg-gray-100 ${
                            isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <span className={isSelected ? 'font-bold text-blue-600' : ''}>{day}</span>
                          {hasEvents && (
                            <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Events for {new Date(selectedDate).toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => openEditModal(event)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{event.title}</span>
                          <Badge className={statusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                          <span>{event.time}</span>
                          <span>•</span>
                          <span className="capitalize">{event.platform}</span>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-xs text-gray-400 line-clamp-2">{event.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <CalendarIcon className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No events for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Events</CardTitle>
                  <CardDescription>{filteredEvents.length} total events</CardDescription>
                </div>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="rounded-md border px-3 py-1.5 text-sm"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEvents.length > 0 ? (
                <div className="space-y-2">
                  {filteredEvents
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-center min-w-[60px]">
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </p>
                            <p className="text-lg font-bold">
                              {new Date(event.date).getDate()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{event.time}</span>
                              <span>•</span>
                              <span className="capitalize">{event.platform}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={statusColor(event.status)}>{event.status}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(event)}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeEvent(event.id)}>
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No events found</p>
                  <p className="text-sm text-gray-400">Add your first event to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      {(showAddModal || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Title</Label>
                <Input
                  id="eventTitle"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDesc">Description</Label>
                <textarea
                  id="eventDesc"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventPlatform">Platform</Label>
                  <select
                    id="eventPlatform"
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventStatus">Status</Label>
                  <select
                    id="eventStatus"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {eventStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEvent(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                {editingEvent ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}