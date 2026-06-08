'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/supabase';
import PlaceCard from '@/components/PlaceCard';
import PlaceDetail from '@/components/PlaceDetail';
import EditPlaceModal from '@/components/EditPlaceModal';

type Props =
    | { kind: 'loupenicka'; place: Tables<'place_loupenicka'>; canManage?: boolean }
    | { kind: 'mistecka'; place: Tables<'place_mistecka'>; canManage?: boolean };

export default function PlaceCardWithDetail(props: Props) {
    const router = useRouter();

    const { place } = props;
    const canManage = props.canManage ?? false;

    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmed = window.confirm(`Opravdu smazat místo "${place.name}"?`);
        if (!confirmed) return;

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            const res = await fetch(`/api/place/${place.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kind: props.kind })
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
            <PlaceCard {...props} onOpenDetail={() => setDetailOpen(true)} />

            {detailOpen && (
                <PlaceDetail
                    {...props}
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
                    {...props}
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
