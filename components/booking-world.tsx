'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
	type Group,
	type InstancedMesh,
	type ShaderMaterial,
	Color,
	InstancedBufferAttribute,
	Object3D,
	BoxGeometry,
} from 'three'

interface BookingWorldProps {
	progress: { current: number }
	shardCount: number
}

const GOLD = new Color('#d3ac2c')
const ORANGE = new Color('#e87812')

const TICK_VERT = `
	attribute float aSeed;
	uniform float uProgress;
	varying float vSeed;

	float hash(float n) {
		return fract(sin(n) * 43758.5453);
	}

	void main() {
		float seed = aSeed;
		vSeed = seed;
		float align = smoothstep(0.12, 0.7, uProgress);
		float tighten = smoothstep(0.68, 1.0, uProgress);
		float angle = seed * 6.2831853;
		float loose = 1.0 - align;
		float radius = mix(2.5, 1.55, align) - tighten * 0.25;
		vec3 pos = vec3(
			cos(angle) * radius + (hash(seed * 2.0) - 0.5) * loose * 2.4,
			(hash(seed * 4.0) - 0.5) * loose * 2.1,
			sin(angle) * radius + (hash(seed * 8.0) - 0.5) * loose * 2.4
		);
		vec3 mark = position;
		mark.y *= mix(0.45, 2.4, align);
		vec4 local = instanceMatrix * vec4(mark, 1.0);
		local.xyz += pos;
		gl_Position = projectionMatrix * modelViewMatrix * local;
	}
`

const TICK_FRAG = `
	varying float vSeed;
	uniform vec3 uGold;
	uniform vec3 uOrange;

	void main() {
		vec3 color = mix(uOrange, uGold, step(0.5, fract(vSeed * 6.0)));
		gl_FragColor = vec4(color, 0.92);
	}
`

const PLATES: Array<{
	from: [number, number, number]
	spin: number
}> = [
	{ from: [-2.3, 1.6, 0.4], spin: 1.1 },
	{ from: [2.1, 1.2, -0.6], spin: -0.8 },
	{ from: [-1.6, -0.2, 1.4], spin: 0.5 },
	{ from: [1.8, -1.1, 0.8], spin: -1.2 },
	{ from: [0.2, 2.2, -1.1], spin: 0.7 },
	{ from: [-0.4, -1.8, -0.5], spin: -0.4 },
]

/**
 * Maps a value into a 0–1 ramp between two scroll stops.
 */
function ramp (value: number, start: number, end: number) {
	const span = end - start
	if (span <= 0) return value >= end ? 1 : 0
	return Math.min(1, Math.max(0, (value - start) / span))
}

/**
 * Marks that tumble, then lock into a circular seal.
 */
function SealTicks ({
	progress,
	shardCount,
}: BookingWorldProps) {
	const mesh = useRef<InstancedMesh>(null)
	const material = useRef<ShaderMaterial>(null)
	const geometry = useMemo(
		() => new BoxGeometry(0.035, 0.16, 0.02),
		[],
	)

	useLayoutEffect(() => {
		const current = mesh.current
		if (!current) return

		const dummy = new Object3D()
		const seeds = new Float32Array(shardCount)

		for (let index = 0; index < shardCount; index += 1) {
			dummy.rotation.y = index
			dummy.updateMatrix()
			current.setMatrixAt(index, dummy.matrix)
			seeds[index] = index / shardCount
		}

		current.instanceMatrix.needsUpdate = true
		geometry.setAttribute(
			'aSeed',
			new InstancedBufferAttribute(seeds, 1),
		)
		current.frustumCulled = false
	}, [geometry, shardCount])

	useFrame(() => {
		if (!material.current) return
		material.current.uniforms.uProgress.value = progress.current
	})

	return (
		<instancedMesh
			ref={mesh}
			args={[geometry, undefined, shardCount]}
		>
			<shaderMaterial
				ref={material}
				vertexShader={TICK_VERT}
				fragmentShader={TICK_FRAG}
				uniforms={{
					uProgress: { value: 0 },
					uGold: { value: GOLD },
					uOrange: { value: ORANGE },
				}}
			/>
		</instancedMesh>
	)
}

/**
 * Plates that fall into one stacked invitation card.
 */
function PressPlates ({
	progress,
}: {
	progress: BookingWorldProps['progress']
}) {
	const groups = useRef<Array<Group | null>>([])

	useFrame(() => {
		const t = progress.current
		const stack = ramp(t, 0.08, 0.62)
		const press = ramp(t, 0.62, 1)

		groups.current.forEach((group, index) => {
			if (!group) return
			const plate = PLATES[index]
			if (!plate) return

			group.position.set(
				plate.from[0] * (1 - stack),
				plate.from[1] * (1 - stack) + index * 0.045 * (1 - press),
				plate.from[2] * (1 - stack),
			)
			group.rotation.set(
				plate.spin * (1 - stack),
				plate.spin * (1 - stack) * 0.6,
				plate.spin * 0.3 * (1 - stack),
			)
			group.scale.setScalar(1 - press * 0.08 * index)
		})
	})

	return (
		<>
			{PLATES.map((plate, index) => (
				<group
					key={plate.spin}
					ref={(node) => {
						groups.current[index] = node
					}}
				>
					<mesh>
						<boxGeometry args={[1.7, 0.035, 1.05]} />
						<meshBasicMaterial
							color={index % 2 === 0 ? '#e87812' : '#d3ac2c'}
							transparent
							opacity={0.88}
						/>
					</mesh>
				</group>
			))}
		</>
	)
}

/**
 * Booking page: a seal drops and locks around an invitation.
 */
export function BookingWorld ({
	progress,
	shardCount,
}: BookingWorldProps) {
	const stamp = useRef<Group>(null)

	useFrame(({ camera }) => {
		const t = progress.current
		const drop = ramp(t, 0.08, 0.95)
		camera.position.set(0.15, 5.1 - drop * 2.4, 2.6 - drop * 0.8)
		camera.lookAt(0, 0, 0)

		if (stamp.current) {
			stamp.current.position.y = 2.6 - ramp(t, 0.35, 0.92) * 2.45
			stamp.current.rotation.z = t * Math.PI * 2
			stamp.current.scale.setScalar(0.72 + ramp(t, 0.2, 1) * 0.55)
		}
	})

	return (
		<>
			<color attach="background" args={['#010203']} />
			<ambientLight intensity={0.45} />
			<PressPlates progress={progress} />
			<SealTicks progress={progress} shardCount={shardCount} />
			<group ref={stamp} rotation={[Math.PI / 2.15, 0, 0]}>
				<mesh>
					<torusGeometry args={[1.05, 0.045, 12, 64]} />
					<meshBasicMaterial color="#e87812" />
				</mesh>
				<mesh>
					<torusGeometry args={[0.62, 0.02, 10, 48]} />
					<meshBasicMaterial color="#d3ac2c" />
				</mesh>
			</group>
		</>
	)
}
