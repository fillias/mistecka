'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/supabase';
import PlaceCard from '@/components/PlaceCard';
import PlaceDetail from '@/components/PlaceDetail';
import EditPlaceModal from '@/components/EditPlaceModal';

type Props = {
    kind: string;
    place: Tables<'place'>;
    canManage?: boolean;
};

export default function PlaceCardWithDetail({ kind, place, canManage = false }: Props) {
    const router = useRouter();

    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmed = window.confirm(`Opravdu smazat místo "${place.place_name}"?`);
        if (!confirmed) return;

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            const res = await fetch(`/api/place/${place.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.error || 'Nepodařilo se smazat místo');
            }

            setDetailOpen(false);
            router.refresh();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Nepodařilo se smazat místo');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <PlaceCard kind={kind} place={place} onOpenDetail={() => setDetailOpen(true)} />

            {detailOpen && (
                <PlaceDetail
                    place={place}
                    canManage={canManage}
                    onClose={() => setDetailOpen(false)}
                    onEdit={() => {
                        setDetailOpen(false);
                        setEditOpen(true);
                    }}
                    onDelete={canManage ? handleDelete : undefined}
                    deleteLoading={deleteLoading}
                    deleteError={deleteError}
                />
            )}

            {canManage && editOpen && (
                <EditPlaceModal
                    place={place}
                    open={editOpen}
                    onOpenChange={(open: boolean) => setEditOpen(open)}
                    onSaved={() => {
                        setEditOpen(false);
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}
